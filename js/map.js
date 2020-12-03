class MapData {
    static get uacClasses() {
        return 'data/LCC_uac_30m_4326.tif'
    }

    static get zoomLevel() { return 12; }
    static get centerCoords() { return [40.60, -111.67]; }

    static get attribution() {
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenTopoMap</a> (CC-BY-SA)';
    }
}

class AreaMap {
    get currentMarker() { return this._currentMarker; }
    set currentMarker(marker) { this._currentMarker = marker; }

    get forecast() { return this._forecast;}
    set forecast(values) { this._forecast = values; }

    get selection() { return this._selection; }
    set selection(value) {
        this._selection = value;
        this.redraw();
    }

    removeMarker() {
        if (this._currentMarker) this.currentMarker.remove();
        this.markerInfo.text('');
    }

    moveMarker(e) {
        this.removeMarker();
        this.currentMarker = L.marker(e.latlng);
        this.currentMarker.addTo(this.baseLayer);
        this.infoAtLatLng(e.latlng.lat, e.latlng.lng)
    }

    get uacClassInfo() {
        return this.raster.values[0];
    }

    get slopeInfo() {
        return this.raster.values[1];
    }

    addBaseLayer() {
        this.baseLayer = L.map("map-area").setView(
            MapData.centerCoords, MapData.zoomLevel
        ).on('click', () => {
            this.removeMarker();
        });

        L.tileLayer('https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
            {
                attribution: MapData.attribution,
                maxZoom: 17,
                opacity: 0.7,
            }
        ).addTo(this.baseLayer);
    }

    constructor() {
        this.addBaseLayer();
        this.dateInfo = d3.select(`span#date-info`);
        this.markerInfo = d3.select('span#marker-info')

        return fetch(MapData.uacClasses)
            .then(response => response.arrayBuffer())
            .then(window.parseGeoraster)
            .then((goeRaster) => {
                this.addLayer(goeRaster);
                return this;
            });
    }

    classToColor(value) {
        if (this.forecast === undefined) return;

        let color = AvalancheDangerColor.colorForId(
            this.forecast[value[0]]
        );

        if (this.selection !== undefined &&
            !this.selection.includes(value[0])) {
            color += '77';  // Set Alpha channel for color
        }

        return color
    }

    addLayer(layerData) {
        /**
         * https://github.com/GeoTIFF/georaster-layer-for-leaflet
         */
        this.dangerlayer = new window.GeoRasterLayer({
            georaster: layerData,
            opacity: 0.6,
            pixelValuesToColorFn: values => {
                return this.classToColor(values)
            },
            debugLevel: 0,
        });
        this.raster = this.dangerlayer.georasters[0];

        this.dangerlayer.addTo(this.baseLayer);

        const that = this;
        this.uacInfo = L.imageOverlay(
            MapData.uacClasses,
            [
                [this.dangerlayer.ymin, this.dangerlayer.xmin],
                [this.dangerlayer.ymax, this.dangerlayer.xmax]
            ],
            {
                interactive: true,
                opacity: 0,
            }
        ).on('click', function (e) {
            that.moveMarker(e);
            L.DomEvent.stopPropagation(e);
        });

        this.uacInfo.addTo(this.baseLayer);
    }

    redraw() {
        this.dangerlayer.redraw();
    }

    lngToRasterX(lng) {
        return Math.floor(
            this.raster.width *
            Math.abs(lng - this.raster.xmin) /
            (this.raster.xmax - this.raster.xmin)
        );
    }

    latToRasterY(lat) {
        return this.raster.height - Math.ceil(
            this.raster.height *
            Math.abs(lat - this.raster.ymin) /
            (this.raster.ymax - this.raster.ymin)
        )
    }

    infoAtLatLng(lat, lng) {
        try {
            const x = this.lngToRasterX(lng);
            const y = this.latToRasterY(lat);
            const uacID = this.uacClassInfo[y][x];
            const info = UACMapper.CLASSES[uacID];
            this.markerInfo.html(
                '<i>Marker</i>' +
                `${info.Elevation}</br>` +
                `Forecast: ${AvalancheDangerColor.LEVELS[this.forecast[uacID]]}</br>` +
                `Aspect: ${info.Aspect}</br>` +
                `Slope Angle: ${this.slopeInfo[y][x]}`
            );
        } catch (err) {
            console.error('No value');
        }
    }

    showForecast(forecast, date) {
        this.selection = undefined;
        this.removeMarker();
        this.dateInfo.text(date.toLocaleDateString());
        this.forecast = forecast;
        this.redraw();
    }
}
