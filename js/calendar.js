class Calendar {
    constructor(selectionSync) {
        this.selectionSync = selectionSync;
        selectionSync.calendar = this;
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

    forecastForDay(day) {
        return this.data.get(day.toJSON());
    }

    dayBackgroundColor(day, uacID = null) {
        if (day === null) {
            return `${Calendar.DAYS_BG_CSS} empty`;
        }

        const forecasts = this.forecastForDay(day);
        if (uacID !== null) {
            const background = AvalancheDangerColor.LEVELS[
                forecasts.values[uacID]
                ];
            return `${Calendar.DAYS_BG_CSS} uac-${background}`;
        } else {
            const max = AvalancheDangerColor.LEVELS[forecasts.max];
            const min = AvalancheDangerColor.LEVELS[forecasts.min];
            return `${Calendar.DAYS_BG_CSS} bg-uac-${max}-${min}`
        }
    }

    daysUacIdBG(uacID) {
        this.days
            .selectAll('rect')
            .attr("class", (d) => this.dayBackgroundColor(d, uacID));
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
                const y = Math.floor(i/7) * Calendar.CELL_SIZE + 3;
                return `translate(${x},${y})`
            });

        let that = this;
        this.days
            .append('rect')
            .attr("width", Calendar.CELL_DIM)
            .attr("height", Calendar.CELL_DIM)
            .attr('rx', 4)
            .attr('class', (d) => this.dayBackgroundColor(d))
            .classed('selected', (d) => d && d.getTime() === date.getTime())
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
        this.selectionSync.setDateInfo(date);
        this.selectionSync.map.showForecast(forecast);
        this.selectionSync.rose.showForecast(forecast);
    }
}

Calendar.CELL_SIZE = 50;  // in pixels
Calendar.CELL_SPACE = 5;
Calendar.CELL_DIM = Calendar.CELL_SIZE - Calendar.CELL_SPACE;
Calendar.DAYS_BG_CSS = 'calendar-day-box';