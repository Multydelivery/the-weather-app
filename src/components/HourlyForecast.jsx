import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './HourlyForecast.css';

const API_KEY = process.env.REACT_APP_API_KEY; // Replace with your OpenWeatherMap API Key

function HourlyForecast({ city }) {
  const [hourlyData, setHourlyData] = useState([]);
  const scrollRef = useRef(null); // reference to the scrollable div or container

  useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        setHourlyData(response.data.list.slice(0, 5)); // Get the first 5 hours of data
      } catch (error) {
        console.error('Error fetching hourly forecast data:', error);
      }
    };

    fetchHourlyData();
  }, [city]);

  // scroll functions
  const scrollLeft = () => {
    scrollRef.current.scrollLeft -= 200;
  };
  const scrollRight = () => {
    scrollRef.current.scrollLeft += 200;
  };

  return (
    <div className='relative mt-6'>
      <div ref={scrollRef} 
        className='flex gap-4 mx-10 py-2 overflow-x-auto scroolbar-hide'
        style={{scrollBehavior:'smooth'}}>

        {hourlyData.map((hour, index) => (
          <div key={index} className='flex flex-col items-center shadow-lg bg-green-100 py-2 rounded px-2'>
            <p>{new Date(hour.dt * 1000).getHours()}:00</p>
            <img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt="weather icon" className='w-10 mx-auto'/>
            <p>{hour.main.temp} °C</p>
          </div>
        ))}
      </div>

      {/* scroll buttons */}
      <button onClick={scrollLeft}
        className='absolute left-0 top-1/2 bg-green-500 text-white -translate-y-1/2
                  rounded-full w-8 h-8 flex items-center justify-center'>
        <FaChevronLeft className='w-4 h-4' />
      </button>

      <button onClick={scrollRight}
        className='absolute right-0 top-1/2 bg-green-500 text-white -translate-y-1/2
                  rounded-full w-8 h-8 flex items-center justify-center'>
        <FaChevronRight className='w-4 h-4' />
      </button>
    </div>
  );
}

export default HourlyForecast;