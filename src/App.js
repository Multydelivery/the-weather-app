import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import HourlyForecast from './components/HourlyForecast';

const API_KEY = process.env.REACT_APP_API_KEY; // Replace with your OpenWeatherMap API Key
const cities = ['New York', 'London', 'Paris', 'Madrid', 'Berlin', 'Rome', 'Tokyo', 'Sydney', 'Beijing', 'Moscow'];

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit

  useEffect(() => {
    const fetchWeatherData = async () => {
      const responses = await Promise.all(
        cities.map(city =>
          axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`)
        )
      );
      setWeatherData(responses.map(response => response.data));
    };

    fetchWeatherData();
  }, [unit]);

  const toggleUnit = () => {
    setUnit(prevUnit => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  const searchCity = () => {
    const input = document.querySelector('input');
    const city = input.value;
    if (!city) return;
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`)
      .then(response => setWeatherData(prevData => [...prevData, response.data]))
      .catch(error => console.error('Error fetching weather data:', error));
    input.value = ''; // Clear the input field
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchCity();
    }
  };

  return (
    <div className="bg-green-500 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg mt-10 p-4 rounded w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <div className='flex border rounded items-center px-2 py-2 w-full'>
            <FaSearch className='h-5 w-5'/>
            <input 
              type="text"
              placeholder="Enter City Name"
              className="pl-2 border-none focus:outline-none w-full"
              onKeyPress={handleKeyPress}
            />
          </div>
          <button onClick={searchCity} className='px-4 py-2 bg-green-500 text-white ml-2 rounded hover:bg-green-600'>
            <FaMapMarkerAlt className='w-5 h-5'/>
          </button>
        </div>
        <button onClick={toggleUnit} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4'>
          Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
        </button>
        <div className='mt-4'>
          {weatherData.map((data, index) => (
            <div key={index} className='text-center mb-4'>
              <h2 className='text-xl font-semibold'>{data.name}</h2>
              <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="weather icon" className='w-20 h-20 mx-auto'/>
              <p className='text-lg font-semibold'>{data.main.temp} °{unit === 'metric' ? 'C' : 'F'}</p>
              <p className='text-sm capitalize font-semibold'>{data.weather[0].description}</p>
              <HourlyForecast city={data.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;