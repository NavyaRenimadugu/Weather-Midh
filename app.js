const apiKey = "c3fd3dfe3a274d9084e120845262505";

let chart;

// AUTO LOAD

window.onload = () => {

  displayHistory();

  fetchWeather("Hyderabad");

};

// SEARCH WEATHER

function getWeather() {

  const city =
    document.getElementById("cityInput")
    .value
    .trim();

  if (city === "") {

    alert("Please enter city");

    return;
  }

  fetchWeather(city);
}

// FETCH WEATHER

async function fetchWeather(city) {

  const loader =
    document.getElementById("loader");

  loader.classList.remove("hidden");

  try {

    const response =
      await fetch(

        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`

      );

    const data =
      await response.json();

    if (data.error) {

      alert(data.error.message);

      loader.classList.add("hidden");

      return;
    }

    displayCurrentWeather(data);

    displayForecast(data);

    createChart(data);

    saveSearch(city);

    dynamicBackground(
      data.current.condition.text
    );

  }

  catch (error) {

    alert(
      "Failed to fetch weather data"
    );

    console.log(error);
  }

  loader.classList.add("hidden");
}

// CURRENT WEATHER

function displayCurrentWeather(data) {

  document.getElementById("cityName")
    .innerText =
    `${data.location.name}, ${data.location.country}`;

  document.getElementById("temp")
    .innerText =
    `${data.current.temp_c}°C`;

  document.getElementById("condition")
    .innerText =
    data.current.condition.text;

  document.getElementById("humidity")
    .innerText =
    `${data.current.humidity}%`;

  document.getElementById("wind")
    .innerText =
    `${data.current.wind_kph} km/h`;

  document.getElementById("feels")
    .innerText =
    `${data.current.feelslike_c}°C`;

  document.getElementById("pressure")
    .innerText =
    `${data.current.pressure_mb}`;

  document.getElementById("weatherIcon")
    .src =
    data.current.condition.icon;
}

// FORECAST

function displayForecast(data) {

  const container =
    document.getElementById("forecastGrid");

  container.innerHTML = "";

  data.forecast.forecastday.forEach(day => {

    const date =
      new Date(day.date);

    const weekday =
      date.toLocaleDateString(
        "en-US",
        { weekday: "long" }
      );

    container.innerHTML += `

      <div class="forecast-card">

        <h3>${weekday}</h3>

        <img src="${day.day.condition.icon}">

        <div class="forecast-temp">
          ${day.day.avgtemp_c}°C
        </div>

        <p>
          ${day.day.condition.text}
        </p>

      </div>

    `;
  });
}

// CHART

function createChart(data) {

  const labels =
    data.forecast.forecastday.map(day => {

      const date =
        new Date(day.date);

      return date.toLocaleDateString(
        "en-US",
        { weekday: "short" }
      );

    });

  const temps =
    data.forecast.forecastday.map(
      day => day.day.avgtemp_c
    );

  const ctx =
    document.getElementById("tempChart");

  if (chart) {

    chart.destroy();
  }

  chart = new Chart(ctx, {

    type: "line",

    data: {

      labels: labels,

      datasets: [{

        label: "Temperature °C",

        data: temps,

        borderColor: "#4f7cff",

        backgroundColor:
          "rgba(79,124,255,0.2)",

        fill: true,

        tension: 0.4

      }]
    },

    options: {

      responsive: true,

      animation: {

        duration: 2000
      },

      plugins: {

        legend: {

          labels: {

            color: "white"
          }
        }
      },

      scales: {

        y: {

          ticks: {

            color: "white"
          }
        },

        x: {

          ticks: {

            color: "white"
          }
        }
      }
    }
  });
}

// SEARCH HISTORY

function saveSearch(city) {

  let history =
    JSON.parse(
      localStorage.getItem("history")
    ) || [];

  if (!history.includes(city)) {

    history.unshift(city);
  }

  history = history.slice(0, 8);

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

  displayHistory();
}

// DISPLAY HISTORY

function displayHistory() {

  const history =
    JSON.parse(
      localStorage.getItem("history")
    ) || [];

  const list =
    document.getElementById("historyList");

  list.innerHTML = "";

  history.forEach(city => {

    list.innerHTML += `

      <li onclick="fetchWeather('${city}')">

        ${city}

      </li>

    `;
  });
}

// ENTER KEY SEARCH

document
  .getElementById("cityInput")
  .addEventListener(
    "keypress",
    function(e) {

      if (e.key === "Enter") {

        getWeather();
      }

    }
  );

// DYNAMIC BACKGROUND

function dynamicBackground(condition) {

  condition =
    condition.toLowerCase();

  if (
    condition.includes("sun")
  ) {

    document.body.style.background =
      "linear-gradient(135deg,#f59e0b,#ea580c)";
  }

  else if (
    condition.includes("rain")
  ) {

    document.body.style.background =
      "linear-gradient(135deg,#0f172a,#1e3a8a)";
  }

  else if (
    condition.includes("cloud")
  ) {

    document.body.style.background =
      "linear-gradient(135deg,#334155,#1e293b)";
  }

  else {

    document.body.style.background =
      "linear-gradient(135deg,#0f172a,#312e81)";
  }

}