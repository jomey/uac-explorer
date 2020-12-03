class UACInfo{
    constructor() {
        this.forecastLink = document.getElementById("daily-forecast");
        this.observationLink = document.getElementById("daily-observations");
        this.currentDateSpan = document.getElementById("info-view-date")
    }

    showTextInfo(date){
        this.currentDateSpan.textContent = date.toLocaleDateString();
        this.updateForecast(date);
        this.updateObservation(date);
    }

    updateForecast(date){
        this.forecastLink.setAttribute(
            'href',
            UACInfo.BASE_URL +
            UACInfo.FORECAST_PREFIX +
            UACInfo.FORECAST_DATE_FORMATTER(date)
        );
    }

    updateObservation(date){
        date = encodeURIComponent(UACInfo.OBSERVATION_DATE_FORMATTER(date));
        this.observationLink.setAttribute(
            'href',
            UACInfo.BASE_URL +
            UACInfo.OBSERVATION_PREFIX +
            '&' + UACInfo.OBSERVATION_MIN_DATE + '=' +
            date +
            '&' + UACInfo.OBSERVATION_MAX_DATE + '=' +
            date
        )
    }
}

UACInfo.BASE_URL = "https://utahavalanchecenter.org";
UACInfo.FORECAST_PREFIX = "/forecast/salt-lake/";
UACInfo.FORECAST_DATE_FORMATTER = d3.timeFormat("%-m/%-d/%Y");
UACInfo.OBSERVATION_PREFIX = "/observations?rid=All&term=6";
UACInfo.OBSERVATION_DATE_FORMATTER = d3.timeFormat("%d/%m/%Y");
UACInfo.OBSERVATION_MIN_DATE = encodeURIComponent("fodv[min][date]");
UACInfo.OBSERVATION_MAX_DATE = encodeURIComponent("fodv[max][date]");
