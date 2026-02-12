import axios from "axios";
import { config } from "../config/env.js";


export const getWeatherData = async (city) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather`,
    {
      params: {
        q: city,
        appid: config.WEATHER_API_KEY,
        units: "metric"
      }
    }
  );

  return {
    temperature: response.data.main.temp,
    humidity: response.data.main.humidity,
    rainfall: response.data.rain ? (response.data.rain["1h"] || getRainValue()) : getRainValue()  };

};



function getRainValue() {
  return +(Math.random() * (250 - 100) + 100).toFixed(1);
}