import React from 'react';
import Navbar from './components/navbar';
import WeatherDashboard from './components/WeatherDashboard';
import Footer from './components/footer';

function App() {
  return (
    <div>
      <Navbar />
      <WeatherDashboard />
      <Footer />
    </div>
  );
}

export default App;
