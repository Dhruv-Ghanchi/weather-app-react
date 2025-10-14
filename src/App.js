import React from 'react';
import Navbar from './components/navbar';
import WeatherDashboard from './components/WeatherDashboard';
import Footer from './components/footer';
import './App.css'; // Make sure to include this for layout styling

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <WeatherDashboard />
      </div>
      <Footer />
    </div>
  );
}

export default App;
