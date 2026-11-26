import { useState } from "react";
import "./App.css";

import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";

import { getWeatherData } from "./services/weatherService";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  async function handleSearch() {
    try {
      const data = await getWeatherData(city);

      setWeather(data.currentWeather);
      setForecast(data.forecast);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="container">
      <h1>Weather Dashboard</h1>

      <div className="search-section">
        <SearchBar
          city={city}
          setCity={setCity}
          onSearch={handleSearch}
        />
      </div>

      {weather && (
        <div className="current-weather">
          <CurrentWeather weather={weather} />
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast-section">
          <Forecast forecast={forecast} />
        </div>
      )}
    </div>
  );
}

export default App;