/*
  Helper class to parse CSV data.
 */
class UACForecasts {
    static parseLevel(levelData) {
        let values = {};
        let level = 1;
        let maxDanger = 0;
        let minDanger = 10;
        let petal;
        for (let i = 0; i < 24; i++) {
            if (i === 8 || level === 16) level++;
            petal = i + 1;
            values[petal] = levelData[
                `${UACForecasts.DATA_PREFIX}-${level}/${Rose.DIRECTIONS[i % 8]}`
                ];
            maxDanger = Math.max(maxDanger, values[petal]);
            minDanger = Math.min(minDanger, values[petal]);
        }
        return {
            values: values,
            max: maxDanger,
            min: minDanger,
        };
    }

    static parse(data) {
        return d3.rollup(
            data,
            v => UACForecasts.parseLevel(v[0]),
            d => new Date(d.date.replace(/-/g, '/')).toJSON(),
        )
    }

    static load() {
        return d3.json('data/january_2020.json')
            .then(data => UACForecasts.parse(data));
    }
}

UACForecasts.DATA_PREFIX = 'data/level';
