import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiFog } from 'react-icons/wi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function WeatherDashboard() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    try {
      setError('');
      const apiKey = '291dffff358a1861bda82033d86c5700'; // replace with your OpenWeather API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      if (data.cod !== '200') throw new Error(data.message);
      setWeather(data);
    } catch (err) {
      setError('City not found or API error!');
      setWeather(null);
    }
  };

  const getWeatherIcon = (desc) => {
    const d = desc.toLowerCase();
    if (d.includes('rain')) return <WiRain size={60} color="#007BFF" />;
    if (d.includes('cloud')) return <WiCloudy size={60} color="#6c757d" />;
    if (d.includes('clear')) return <WiDaySunny size={60} color="#FFC107" />;
    if (d.includes('snow')) return <WiSnow size={60} color="#17a2b8" />;
    return <WiFog size={60} color="#adb5bd" />;
  };

  const chartData = weather && {
    labels: weather.list.slice(0, 7).map(item => item.dt_txt.split(' ')[0]),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: weather.list.slice(0, 7).map(item => item.main.temp),
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13,110,253,0.1)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4 text-primary fw-bold">🌤️ Weather Dashboard</h2>

        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="btn btn-primary" onClick={fetchWeather}>
            Search
          </button>
        </div>

        {error && <p className="text-danger text-center">{error}</p>}

        {weather && (
          <div className="text-center">
            <h3 className="fw-bold">{weather.city.name}</h3>
            <p className="lead text-capitalize">{weather.list[0].weather[0].description}</p>
            <div className="d-flex justify-content-center align-items-center mb-3">
              {getWeatherIcon(weather.list[0].weather[0].description)}
            </div>

            <div className="card p-3 bg-light mb-4 mx-auto" style={{ maxWidth: '400px' }}>
              <p className="mb-1"><strong>Temperature:</strong> {weather.list[0].main.temp}°C</p>
              <p className="mb-1"><strong>Humidity:</strong> {weather.list[0].main.humidity}%</p>
              <p className="mb-0"><strong>Wind Speed:</strong> {weather.list[0].wind.speed} m/s</p>
            </div>

            <div className="card p-3 shadow-sm">
              <Line data={chartData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherDashboard;
