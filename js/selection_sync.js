class SelectionSync {
    get map() { return this._map }
    set map(value) { this._map = value; }

    get rose() { return this._rose }
    set rose(value) { this._rose = value; }

    constructor() {
        this.dateSpan = d3.select(`span#date-info`);
        this.markerSpan = d3.select('span#marker-info')
        this.roseSpan = d3.select('span#rose-info');
        this.info = new UACInfo();
    }

    setDateInfo(date) {
        this.dateSpan.html(date.toLocaleDateString());
        this.info.showTextInfo(date);
    }

    markerInfoText() {
        const info = UACMapper.CLASSES[this.map.currentMarker.uacInfo.uacID];
        return `${info.Elevation}</br>` +
            `Forecast: ${AvalancheDangerColor.LEVELS[this.map.currentMarker.uacInfo.forecast]}</br>` +
            `Aspect: ${info.Aspect}</br>` +
            `Slope Angle: ${this.map.currentMarker.uacInfo.slopeInfo}`
    }

    setMarkerInfo() {
        let text = '';
        if (this.map.currentMarker) {
            text = '<i>Marker Info</i>' + this.markerInfoText();
            this.rose.selectPetal(this.map.currentMarker.uacInfo.uacID);
            this.setRoseInfo();
        }
        this.markerSpan.html(text);
    }

    roseInfoText(node) {
        const petalInfo = UACMapper.CLASSES[node.data];
        return `${petalInfo.Aspect} - ${petalInfo.Elevation}<br/>` +
            `Forecast: ${AvalancheDangerColor.LEVELS[node.forecast]}`
    }

    setRoseInfo(value = null) {
        let text = '';
        if (value) {
            text += '<i>Rose Filter</i>';
            if (typeof(value) === 'object') {
                text += this.roseInfoText(value);
            } else if (typeof(value) === 'string') {
                text += value;
            }
        }
        this.roseSpan.html(text);
    }
}
