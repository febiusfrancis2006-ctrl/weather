
function getWeatherInfo(code) {
  if (code === 0) return {  description: "Sunny" };
  if (code === 1 || code === 2) return {  description: "Partly Cloudy" };
  if (code === 3) return {  description: "Cloudy" };
  if (code >= 45 && code <= 48) return {  description: "Foggy" };
  if (code >= 51 && code <= 57) return { description: "Drizzle" };
  if (code >= 61 && code <= 67) return { description: "Rainy" };
  if (code >= 71 && code <= 77) return { description: "Snowy" };
  if (code >= 80 && code <= 82) return { description: "Rain Showers" };
  if (code >= 95) return {  description: "Thunderstorm" };
  return {  description: "Weather" };
}

export async function getWeatherData(city) {

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const currentResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
  );

  const currentData = await currentResponse.json();

  if (!currentResponse.ok) {
    throw new Error(currentData.message || "City not found");
  }

  const currentWeather = {
    city: currentData.name,
    temperature: currentData.main.temp,
    humidity: currentData.main.humidity,
    wind: currentData.wind.speed,
    icon: currentData.weather[0].icon,
    description: currentData.weather[0].description
  };

  
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );

  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("City not found in forecast service");
  }

  const latitude = geoData.results[0].latitude;
  const longitude = geoData.results[0].longitude;

  const forecastResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`
  );

  const forecastData = await forecastResponse.json();

  
  const forecast = forecastData.daily.time.map((date, index) => {
    const info = getWeatherInfo(forecastData.daily.weather_code[index]);

    return {
      date,
      icon: info.icon,
      description: info.description,
      maxTemp: forecastData.daily.temperature_2m_max[index],
      minTemp: forecastData.daily.temperature_2m_min[index]
    };
  });

  return { currentWeather, forecast };
}
