const apiKey = "04f8657056b37c5e527a87d8aa122ba5";

// Fetch Current Weather + Forecast
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const weatherInfo = document.getElementById("weatherInfo");
  const forecastDays = document.getElementById("forecastDays");

  if (city === "") {
    weatherInfo.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  try {
    // Current Weather API
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const weatherRes = await fetch(weatherURL);
    const weatherData = await weatherRes.json();

    if (weatherData.cod === "404") {
      weatherInfo.innerHTML = "<p>City not found.</p>";
      return;
    }

    // Display Current Weather
    weatherInfo.innerHTML = `
      <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
      <p>🌡 Temperature: ${weatherData.main.temp}°C</p>
      <p>☁ Weather: ${weatherData.weather[0].description}</p>
      <p>💧 Humidity: ${weatherData.main.humidity}%</p>
      <p>🌬 Wind: ${weatherData.wind.speed} m/s</p>
    `;

    // Forecast API (5 Days / 3-Hour intervals)
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const forecastRes = await fetch(forecastURL);
    const forecastData = await forecastRes.json();

    // Extract 3 days (24-hour intervals)
    const threeDays = [8, 16, 24]; // approx next 3 days at same time

    forecastDays.innerHTML = ""; // Clear old data

    threeDays.forEach(i => {
      const day = forecastData.list[i];
      const date = new Date(day.dt_txt).toDateString();

      const card = `
        <div class="day-card">
          <div class="day-date">${date}</div>
          <div class="day-weather-icon">
            <img src="https://openweathermap.org/img/w/${day.weather[0].icon}.png" />
          </div>
          <div class="day-temperature">${day.main.temp}°C</div>
          <div class="day-description">${day.weather[0].description}</div>
        </div>
      `;

      forecastDays.innerHTML += card;
    });

  } catch (error) {
    weatherInfo.innerHTML = "<p>Error fetching data. Try again later.</p>";
  }
}
