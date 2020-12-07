class Rose {
    constructor(selectionSync) {
        this.menu = new RoseMenu(this);
        this.selectionSync = selectionSync;
        this.selectionSync.rose = this;
    }

    levelArcs(level) {
        const offset = level - 1
        return d3.arc()
            .innerRadius(offset * Rose.RADIUS + offset)
            .outerRadius(level * Rose.RADIUS + offset)
            .startAngle(d => { return d.startAngle - Rose.PETAL_OFFSET })
            .endAngle(d => { return d.endAngle - Rose.PETAL_OFFSET });
    }

    selectPetal(id) {
        const that = this;
        this.menu.clear();
        that.selectionSync.map.selection = [id];
        this.svg.selectAll('.petal')
            .filter((d) => d.data === id)
            .each(function(d) { that.highlightPetal(this, d, true) });
    }

    highlightPetal(petal, d, force = false) {
        if (this.selectionSync.map.selection === undefined || force) {
            this.clearHighlightPetal(force);
            d3.select(petal).classed('hover', true).raise();
            d3.selectAll('.petal:not(.hover)').classed('opaque', true);
            this.selectionSync.setRoseInfo(d);
        } else if (petal) {
            d3.select(petal).classed('hover', true).raise();
        }
    }

    clearHighlightPetal(force = false) {
        if (this.selectionSync.map.selection === undefined || force) {
            this.svg.selectAll('.petal').attr('class', 'petal');
            this.selectionSync.setRoseInfo();
        } else {
            d3.select('.hover.opaque').classed('hover', false);
        }
    }

    addElevationLevel(ids, level) {
        let that = this;
        this.svg.append("g")
            .selectAll("path")
            .data(d3.pie().value(() => Rose.PETAL_ARC)(ids))
            .enter()
            .append("path")
            .attr('fill', 'none')
            .classed('petal', true)
            .attr("d", this.levelArcs(level))
            .on('mouseover', function (_e, d) {
                that.svgHelperText.text('');
                that.highlightPetal(this, d);
            })
            .on('mouseout', () => this.clearHighlightPetal())
            .on('click', (e, d) => {
                e.stopPropagation();
                this.selectionSync.map.selection = [d.data];
                this.menu.clear();
                this.highlightPetal(e.currentTarget, d, true);
            });
    }

    draw() {
        const div = d3.select("#rose-view");

        this.svg = div.append("svg")
            .attr("id", "rose-diagram")
            .attr("width", "100%")
            .attr("height", "100%")
            .on('mouseover', (e) => {
                if (e.target === this.svg.node()) {
                    if (this.selectionSync.map.hasSelection) {
                        this.svgHelperText.text('CLick to clear selection');
                    } else {
                        this.svgHelperText.text('');
                    }
                }
            })
            .on('click',  (e) => {
                e.stopPropagation();
                this.selectionSync.map.selection = undefined;
                this.selectionSync.map.removeMarker();
                this.menu.clear();
                this.clearHighlightPetal(true);
            });

        this.svgHelperText = this.svg.append('svg:title')
            .classed('clear-selection', true);

        // From inside out
        this.addElevationLevel(UACMapper.HIGH_ELEVATION_IDS.all, 1)
        this.addElevationLevel(UACMapper.MID_ELEVATION_IDS.all, 2)
        this.addElevationLevel(UACMapper.LOW_ELEVATION_IDS.all, 3)

        const textPositions = this.levelArcs(4);
        this.svg.append("g").selectAll("path")
            .data(
                d3.pie().value(() => Rose.PETAL_ARC)(Rose.DIRECTIONS)
            )
            .enter()
            .append("text")
            .attr("transform", d => `translate(${textPositions.centroid(d)})`)
            .attr('class', 'petal-label')
            .text((d) => d.data);

        this.menu.addOptions();
    }

    showForecast(forecast) {
        this.clearHighlightPetal(true);
        this.menu.clear();
        this.svg
            .selectAll('.petal')
            .attr("fill", (d) => {
                d['forecast'] = forecast[d.data];
                return AvalancheDangerColor.colorForId(d.forecast)
            });
    }
}
Rose.DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
Rose.RADIUS = 50;
Rose.PETAL_ARC = Math.PI / 4;
Rose.PETAL_OFFSET = Math.PI / 8;
