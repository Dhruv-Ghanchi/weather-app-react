import React, { useState, useEffect } from 'react';
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
  const trendingCities = ['London', 'New York', 'Tokyo']; // Trending cities
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');

  // Map weather description to card background & chart color
  const weatherStyles = {
    rain: { card: 'linear-gradient(135deg, #667eea, #764ba2)', chart: '#d1d8ff', text: 'white' },
    cloud: { card: 'linear-gradient(135deg, #bdc3c7, #2c3e50)', chart: '#a0a8b7', text: 'white' },
    clear: { card: 'linear-gradient(135deg, #f6d365, #fda085)', chart: '#fff3c4', text: 'white' },
    snow: { card: 'linear-gradient(135deg, #e0eafc, #cfdef3)', chart: '#cfdaf3', text: '#333' },
    fog: { card: 'linear-gradient(135deg, #d7d2cc, #304352)', chart: '#aab2bb', text: 'white' },
    sunset: { card: 'linear-gradient(135deg, #FFD700, #FF4500)', chart: '#ffe1b5', text: 'white' }
  };

  const getWeatherKey = (desc) => {
    const d = desc.toLowerCase();
    if (d.includes('rain')) return 'rain';
    if (d.includes('cloud')) return 'cloud';
    if (d.includes('clear')) return 'clear';
    if (d.includes('snow')) return 'snow';
    if (d.includes('sunset') || d.includes('sun')) return 'sunset';
    return 'fog';
  };

  const getWeatherIcon = (desc) => {
    const d = desc.toLowerCase();
    if (d.includes('rain')) return <WiRain size={60} color="#007BFF" />;
    if (d.includes('cloud')) return <WiCloudy size={60} color="#6c757d" />;
    if (d.includes('clear')) return <WiDaySunny size={60} color="#FFC107" />;
    if (d.includes('snow')) return <WiSnow size={60} color="#17a2b8" />;
    return <WiFog size={60} color="#adb5bd" />;
  };

  // Load trending cities
  useEffect(() => {
    const loadTrendingCities = async () => {
      const loadedCities = [];
      for (const city of trendingCities) {
        try {
          const apiKey = '291dffff358a1861bda82033d86c5700';
          const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
          const data = await response.json();
          if (data.cod === '200' && !loadedCities.some(c => c.city.id === data.city.id)) {
            loadedCities.push(data);
          }
        } catch (err) {
          console.log(`Error fetching ${city}:`, err);
        }
      }
      setCities(loadedCities);
    };
    loadTrendingCities();
  }, []);

  // Search city
  const fetchWeather = async () => {
    if (!city) return;
    try {
      setError('');
      const apiKey = '291dffff358a1861bda82033d86c5700';
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
      const data = await response.json();
      if (data.cod !== '200') throw new Error(data.message);

      setCities([data]); // show only searched city
      setCity('');
    } catch (err) {
      setError('City not found or API error!');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchWeather();
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
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-primary" onClick={fetchWeather}>
            Search
          </button>
        </div>

        {error && <p className="text-danger text-center">{error}</p>}

        <div className="row">
          {cities.map((w, idx) => {
            const key = getWeatherKey(w.list[0].weather[0].description);
            const style = weatherStyles[key];
            return (
              <div key={idx} className="col-md-4 mb-4">
                <div
                  className="card p-3 shadow mt-3"
                  style={{ minHeight: '450px', background: style.card, color: style.text, borderRadius: '15px' }}
                >
                  <h4 className="fw-bold">{w.city.name}</h4>
                  <p className="text-capitalize">{w.list[0].weather[0].description}</p>
                  <div className="d-flex justify-content-center align-items-center mb-3 weather-icon">
                    {getWeatherIcon(w.list[0].weather[0].description)}
                  </div>
                  <p><strong>Temp:</strong> {w.list[0].main.temp}°C</p>
                  <p><strong>Humidity:</strong> {w.list[0].main.humidity}%</p>
                  <p><strong>Wind:</strong> {w.list[0].wind.speed} m/s</p>

                  {/* Chart for each city */}
                  <div className="mt-3">
                    <Line
                      data={{
                        labels: w.list.slice(0, 7).map(item => item.dt_txt.split(' ')[0]),
                        datasets: [
                          {
                            label: 'Temperature (°C)',
                            data: w.list.slice(0, 7).map(item => item.main.temp),
                            borderColor: style.text,
                            backgroundColor: style.chart,
                            tension: 0.3,
                          },
                        ],
                      }}
                      options={{
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { grid: { color: 'rgba(255,255,255,0.2)' }, ticks: { color: style.text } },
                          x: { grid: { color: 'rgba(255,255,255,0.2)' }, ticks: { color: style.text } }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WeatherDashboard;
