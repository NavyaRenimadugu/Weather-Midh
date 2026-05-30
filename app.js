const API_URL = "http://localhost:8080/api";

let chart;

window.onload = () => {
  displayHistory();
  fetchWeather("Hyderabad");
  addEnterKeyListener();
};

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (city === "") {
    showNotification("Please enter a city name", "error");
    return;
  }
  document.getElementById("cityInput").value = "";
  fetchWeather(city);
}

async function fetchWeather(city) {
  const loader = document.getElementById("loader");
  loader.classList.remove("hidden");

  try {
    const response = await fetch(
      `${API_URL}/weather/forecast?city=${encodeURIComponent(city)}&days=7`
    );

    if (!response.ok) {
      const error = await response.json();
      showNotification(error.message || "City not found", "error");
      loader.classList.add("hidden");
      return;
    }

    const data = await response.json();
    displayCurrentWeather(data);
    displayForecast(data);
    createChart(data);
    saveSearch(city);
    dynamicBackground(data.location.name, data.current.condition.text);
    showNotification(`Weather loaded for ${city}`, "success");
  } catch (error) {
    showNotification("Failed to fetch weather", "error");
  }

  loader.classList.add("hidden");
}

function displayCurrentWeather(data) {
  document.getElementById("cityName").innerText = `${data.location.name}, ${data.location.country}`;
  document.getElementById("temp").innerText = `${Math.round(data.current.temp_c)}°C`;
  document.getElementById("condition").innerText = data.current.condition.text;
  document.getElementById("humidity").innerText = `${data.current.humidity}%`;
  document.getElementById("wind").innerText = `${data.current.wind_kph.toFixed(1)} km/h`;
  document.getElementById("feels").innerText = `${Math.round(data.current.feelslike_c)}°C`;
  document.getElementById("pressure").innerText = `${data.current.pressure_mb} mb`;
  document.getElementById("weatherIcon").src = data.current.condition.icon;
  document.getElementById("weatherIcon").alt = data.current.condition.text;
}

function displayForecast(data) {
  const container = document.getElementById("forecastGrid");
  container.innerHTML = "";

  data.forecast.forecastday.forEach((day, index) => {
    const date = new Date(day.date);
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
      <h3>${weekday}</h3>
      <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-bottom: 8px;">
        ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      </div>
      <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" style="margin: 8px auto;">
      <div class="forecast-temp">${Math.round(day.day.avgtemp_c)}°</div>
      <p>${day.day.condition.text}</p>
      <div style="font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-top: 8px;">
        💧 ${day.day.daily_chance_of_rain}% rain
      </div>
    `;
    container.appendChild(card);
  });
}

function createChart(data) {
  const labels = data.forecast.forecastday.map(day => {
    const date = new Date(day.date);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  });

  const temps = data.forecast.forecastday.map(day => Math.round(day.day.avgtemp_c));
  const maxTemps = data.forecast.forecastday.map(day => Math.round(day.day.maxtemp_c));
  const minTemps = data.forecast.forecastday.map(day => Math.round(day.day.mintemp_c));

  const ctx = document.getElementById("tempChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Avg Temperature °C",
          data: temps,
          borderColor: "#4f7cff",
          backgroundColor: "rgba(79,124,255,0.15)",
          fill: true,
          tension: 0.5,
          pointRadius: 6,
          pointBackgroundColor: "#4f7cff",
          pointBorderColor: "rgba(255,255,255,0.3)",
          pointBorderWidth: 2,
          borderWidth: 3,
        },
        {
          label: "Max Temperature °C",
          data: maxTemps,
          borderColor: "#ff6b6b",
          backgroundColor: "rgba(255,107,107,0.1)",
          fill: true,
          tension: 0.5,
          pointRadius: 4,
          pointBackgroundColor: "#ff6b6b",
          borderWidth: 2,
        },
        {
          label: "Min Temperature °C",
          data: minTemps,
          borderColor: "#4ecdc4",
          backgroundColor: "rgba(78,205,196,0.1)",
          fill: true,
          tension: 0.5,
          pointRadius: 4,
          pointBackgroundColor: "#4ecdc4",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 2500 },
      plugins: {
        legend: {
          labels: {
            color: "white",
            padding: 20,
            font: { size: 14, weight: "600" },
          },
        },
      },
      scales: {
        y: {
          ticks: { color: "rgba(255,255,255,0.7)" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
        x: {
          ticks: { color: "rgba(255,255,255,0.7)" },
          grid: { display: false },
        },
      },
    },
  });
}

function saveSearch(city) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  if (!history.includes(city)) history.unshift(city);
  localStorage.setItem("history", JSON.stringify(history.slice(0, 10)));
  displayHistory();
}

function displayHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  history.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => fetchWeather(city);
    list.appendChild(li);
  });
}

function addEnterKeyListener() {
  document.getElementById("cityInput").addEventListener("keypress", e => {
    if (e.key === "Enter") getWeather();
  });
}

const cityImageMap = {
  "hyderabad": "IMG/TG.png",
  "telangana": "IMG/TG.png",
  "andhra": "IMG/AP.png",
  "pradesh": "IMG/AP.png",
  "london": "IMG/city_02.png",
  "new york": "IMG/city_03.png",
  "paris": "IMG/city_04.png",
  "tokyo": "IMG/city_05.png",
  "dubai": "IMG/city_06.png",
  "mumbai": "IMG/city_07.png",
  "delhi": "IMG/city_08.png",
  "bangalore": "IMG/city_09.png",
  "singapore": "IMG/city_10.png",
  "sydney": "IMG/city_11.png",
  "toronto": "IMG/city_12.png",
  "vancouver": "IMG/city_13.png",
  "seattle": "IMG/city_14.png",
  "los angeles": "IMG/city_15.png",
  "san francisco": "IMG/city_16.png",
  "chicago": "IMG/city_17.png",
  "miami": "IMG/city_18.png",
  "boston": "IMG/city_19.png",
  "las vegas": "IMG/city_20.png",
  "bangkok": "IMG/city_21.png",
  "hong kong": "IMG/city_22.png",
  "shanghai": "IMG/city_23.png",
  "amsterdam": "IMG/city_25.png",
  "berlin": "IMG/city_26.png",
  "rome": "IMG/city_27.png",
  "barcelona": "IMG/city_28.png",
  "madrid": "IMG/city_29.png",
  "istanbul": "IMG/city_30.png",
};

function getCityImage(cityName) {
  const city = cityName.toLowerCase();
  for (const [key, value] of Object.entries(cityImageMap)) {
    if (city.includes(key) || key.includes(city.split(",")[0])) {
      return value;
    }
  }
  const randomIndex = Math.floor(Math.random() * 29) + 2;
  return `IMG/city_${randomIndex}.png`;
}

function dynamicBackground(cityName, condition) {
  const imageUrl = getCityImage(cityName);
  document.body.style.backgroundImage = `url('${imageUrl}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";

  const overlay = document.body.style.background;
  document.body.style.background = `linear-gradient(rgba(15, 23, 42, 0.6), rgba(26, 31, 58, 0.6)), url('${imageUrl}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 16px 24px;
    border-radius: 12px; color: white; font-weight: 600;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    animation: slideIn 0.4s ease; z-index: 1000; backdrop-filter: blur(10px);
    background: ${type === "error" ? "rgba(239, 68, 68, 0.9)" : type === "success" ? "rgba(34, 197, 94, 0.9)" : "rgba(79, 124, 255, 0.9)"};
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = "slideOut 0.4s ease";
    setTimeout(() => notification.remove(), 400);
  }, 3000);
}

const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn { from { opacity: 0; transform: translateX(400px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(400px); } }
`;
document.head.appendChild(style);