const apiKey = "c3fd3dfe3a274d9084e120845262505";

let chart;

async function getWeather() {

  const city =
    document.getElementById("cityInput").value;

  const loader =
    document.getElementById("loader");

  loader.classList.remove("hidden");

  try {

    const response =
      await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`
      );

    const data = await response.json();

    displayCurrentWeather(data);

    displayForecast(data);

    createChart(data);

    saveSearch(city);

  } catch (error) {

    alert("Failed to fetch weather data");

  }

  loader.classList.add("hidden");
}

function displayCurrentWeather(data) {

  document.getElementById("cityName").innerText =
    data.location.name;

  document.getElementById("temperature").innerText =
    `${data.current.temp_c} °C`;

  document.getElementById("condition").innerText =
    data.current.condition.text;

  document.getElementById("humidity").innerText =
    `Humidity: ${data.current.humidity}%`;

  document.getElementById("wind").innerText =
    `Wind: ${data.current.wind_kph} km/h`;

  document.getElementById("weatherIcon").src =
    data.current.condition.icon;
}

function displayForecast(data) {

  const container =
    document.getElementById("forecastContainer");

  container.innerHTML = "";

  data.forecast.forecastday.forEach(day => {

    container.innerHTML += `

      <div class="forecast-card">

        <h3>${day.date}</h3>

        <img src="${day.day.condition.icon}">

        <p>${day.day.avgtemp_c} °C</p>

        <p>${day.day.condition.text}</p>

      </div>
    `;
  });
}

function createChart(data) {

  const labels =
    data.forecast.forecastday.map(day => day.date);

  const temps =
    data.forecast.forecastday.map(day => day.day.avgtemp_c);

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

        tension: 0.4

      }]
    }
  });
}

function saveSearch(city) {

  let history =
    JSON.parse(localStorage.getItem("history")) || [];

  if (!history.includes(city)) {

    history.push(city);

    localStorage.setItem(
      "history",
      JSON.stringify(history)
    );
  }

  displayHistory();
}

function displayHistory() {

  const history =
    JSON.parse(localStorage.getItem("history")) || [];

  const list =
    document.getElementById("historyList");

  list.innerHTML = "";

  history.forEach(city => {

    list.innerHTML += `<li>${city}</li>`;
  });
}

displayHistory();