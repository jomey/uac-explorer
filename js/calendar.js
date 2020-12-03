class Calendar {
    constructor(rose, map) {
        this.rose = rose;
        this.map = map;
        this.info = new UACInfo();
    }

    show() {
        UACForecasts.load().then((data) => {
            this.data = data;
            const date = new Date('01/01/2020');
            this.selectDate(date);
            this.addDays(date);
        });

        this.svg = d3.select('#calendar-view')
            .append("svg")
            .attr("id", "calendar")
            .attr("width", "100%")
            .attr("height", "100%");
    }

    dayRectCss(d) {
        let cssClass = 'calendar-day-box';
        if (d === null) return cssClass;
        const forecasts = this.data.get(d.toJSON());
        const max = AvalancheDangerColor.LEVELS[forecasts.max];
        const min = AvalancheDangerColor.LEVELS[forecasts.min];
        return `${cssClass} bg-uac-${max}-${min}`
    }

    addDays(date) {
        let days = [...this.data.keys()].map((k) => {
            return new Date(k)
        });
        // Start the week on a Monday
        const dayPad = new Array(days[0].getDay() - 1).fill(null);
        AvalancheDangerColor.addGradients(this.svg);

        this.days = this.svg
            .selectAll("g")
            .data([...dayPad, ...days])
            .join('g')
            .attr('transform', (_d, i) => {
                const x = i % 7 * Calendar.CELL_SIZE + 3;
                const y = parseInt(i/7) * Calendar.CELL_SIZE + 3;
                return `translate(${x},${y})`
            });

        let that = this;
        this.days
            .append('rect')
            .attr("width", Calendar.CELL_DIM)
            .attr("height", Calendar.CELL_DIM)
            .attr('rx', 4)
            .attr("class", (d) => this.dayRectCss(d))
            .classed('selected', (d) => d && d.getTime() === date.getTime())
            .classed('empty', (d) => d === null)
            .on('click', function(e, d) {
                e.stopPropagation();
                that.selectDate(d);
                that.days.selectAll('rect').classed('selected', false);
                d3.select(this).classed('selected', true);
            });

        this.days
            .append("text")
            .attr("x", Calendar.CELL_DIM/2)
            .attr("y", Calendar.CELL_DIM/2)
            .attr("class", 'calendar-day-text')
            .text((d) => d ? d.getDate() : d)
            .on('click', () => { return true });
    }

    selectDate(date) {
        const forecast = this.data.get(date.toJSON()).values;
        this.map.showForecast(forecast, date);
        this.rose.showForecast(forecast);
        this.info.showTextInfo(date);
    }
}

Calendar.CELL_SIZE = 50;  // in pixels
Calendar.CELL_SPACE = 5;
Calendar.CELL_DIM = Calendar.CELL_SIZE - Calendar.CELL_SPACE;