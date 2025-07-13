class weatherProcessor {
  constructor() {
    this.dom = new dom();
  }

  init() {
    this.getLocation();
  }

  getLocation() {
    this.dom.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(this.dom.form);
      this.location = formData.get("address");
      this.dom.hideForm();
      this.processWeather();
    });
  }

  async getWeather() {
    try {
      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${this.location}?key=W4SXUHWGCYRGBTEUJ4V3GLEA7`,
        { mode: "cors" }
      );
      this.weatherData = await response.json();
      if (!response.ok) {
        throw new Error("bad request");
      }
    } catch {
      this.dom.displayForm();
      this.dom.getLocation();
    }
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
      today["Description"] = day.description;
      today["Icon"] = day.icon;
      daysInfo[day.datetime] = today;
    }

    console.log(daysInfo);

    this.dom.displayInterface(this.addressString, this.description, daysInfo);
  }
}

class dom {
  constructor() {
    this.mainContainer = document.getElementById("main-container");
    this.displayForm();
  }

  displayForm() {
    // Create form element
    const form = document.createElement("form");

    // Create label for address
    const label = document.createElement("label");
    label.htmlFor = "address";
    label.textContent = "Please put in your city name: ";

    // Create input for address
    const input = document.createElement("input");
    input.type = "text";
    input.id = "address";
    input.name = "address";

    // Optional: Create a submit button
    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Submit";

    // Append elements to the form
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(button);

    this.form = form;

    // Append form to the body (or a container)
    this.mainContainer.appendChild(form);
  }

  hideForm() {
    this.form.classList.add("hidden");
  }

  displayInterface(name, trend, daysInfo) {
    const cityElem = document.createElement("h2");
    cityElem.id = "city-name";
    cityElem.textContent = name;

    const trendElem = document.createElement("h3");
    trendElem.id = "trend";
    trendElem.textContent = trend;

    const forecastDiv = document.createElement("div");
    forecastDiv.id = "forecast-div";

    for (const [key, value] of Object.entries(daysInfo)) {
      const dayDiv = document.createElement("div");
      dayDiv.id = "day-div";

      // append date
      const date = document.createElement("p");
      date.textContent = `${key}`;
      dayDiv.appendChild(date);

      // append img
      const img = document.createElement("img");
      img.src = `./svg/${value["Icon"]}.svg`;
      dayDiv.appendChild(img);

      // append description
      const description = document.createElement("p");
      description.textContent = `${value["Description"]}`;
      dayDiv.appendChild(description);

      // append max temp
      const maxTemp = document.createElement("p");
      maxTemp.textContent = `Max: ${value["Max Temperature"]}°`;
      dayDiv.appendChild(maxTemp);

      // append min temp
      const minTemp = document.createElement("p");
      minTemp.textContent = `Min: ${value["Min Temperature"]}°`;
      dayDiv.appendChild(minTemp);

      forecastDiv.appendChild(dayDiv);
    }

    this.mainContainer.append(cityElem, trendElem, forecastDiv);
  }
}

const wp = new weatherProcessor();
wp.init();
