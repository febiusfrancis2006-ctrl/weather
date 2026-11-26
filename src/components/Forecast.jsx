function Forecast({ forecast }) {
  return (
    <div>
      <h2>7-Day Forecast</h2>

      {forecast.map((day) => (
        <div key={day.date}>
          <p>{day.date}</p>
          <p>{day.description}</p>
          <p>Max: {day.maxTemp}°C</p>
          <p>Min: {day.minTemp}°C</p>
        </div>
      ))}
    </div>
  );
}

export default Forecast;