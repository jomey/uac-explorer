class RoseMenu {
    constructor(rose) {
        this.rose = rose;
    }

    addOptions() {
        let that = this;
        this.aspects = d3.select('#rose-aspects');
        this.aspects.selectAll("option")
            .data(UACMapper.ASPECTS.keys())
            .enter()
            .append("option")
            .text(d => d)
            .attr("value", d => d);

        this.aspects
            .on('change', function (e) {
                that.elevations.node().selectedIndex = 0;
                that.updateMap(this, UACMapper.ASPECTS);
            });

        this.elevations = d3.select("#rose-elevations");
        this.elevations.selectAll("option")
            .data(UACMapper.ELEVATIONS.keys())
            .enter()
            .append("option")
            .text((d) => d)
            .attr("value", (d) => d);

        this.elevations
            .on('change', function () {
                that.aspects.node().selectedIndex = 0;
                that.updateMap(this, UACMapper.ELEVATIONS);
            });
    }

    clear() {
        this.aspects.node().selectedIndex = 0;
        this.elevations.node().selectedIndex = 0;
    }

    updateMap(menu, data) {
        let selection = menu.selectedIndex;
        if (selection === 0) {
            selection = undefined;
        } else {
            selection = data.get(
                menu.options[selection].value
            ).map(a => a.ID);
        }
        this.rose.selectionSync.map.selection = selection;
        this.rose.clearHighlightPetal(true);
        if (selection) {
            this.rose.svg.selectAll('.petal')
                .filter((d) => {
                    return this.rose.selectionSync.map.selection.includes(d.data);
                })
                .classed('hover', true)
                .raise();
            d3.selectAll('.petal:not(.hover)').classed('opaque', true);
            this.rose.selectionSync.setRoseInfo(menu.value);
        } else {
            this.rose.selectionSync.setRoseInfo();
        }
    }
}
