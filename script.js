class weatherProcessor {
  constructor(location) {
    this.location = location;
  }

  async init() {
    await this.processWeather();
  }

  async getWeather() {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${this.location}?key=W4SXUHWGCYRGBTEUJ4V3GLEA7`,
      { mode: "cors" }
    );
    this.weatherData = await response.json();
  }

  async processWeather() {
    await this.getWeather();
    this.addressString = this.weatherData.resolvedAddress;
    this.description = this.weatherData.description;
    console.log(this.addressString + this.description);

    const daysArray = this.weatherData.days;
    let daysInfo = {};
    for (let i = 0; i < 3; i++) {
      const day = daysArray[i];
      let today = {};
      today[`Max Temperature`] = day.tempmax;
      today[`Min Temperature`] = day.tempmin;
      daysInfo[day.datetime] = today;
    }

    console.log(daysInfo);
  }
}

const wp = new weatherProcessor("amsterdam");
wp.init();
