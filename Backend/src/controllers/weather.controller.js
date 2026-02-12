import { getWeatherData } from "../services/weather.service.js";

export const fetchWeather = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        message: "city query parameter is required"
      });
    }

    const weather = await getWeatherData(city);

    res.json({
      source: "openweather",
      editable: true,
      weather
    });
  } catch (err) {
    next(err);
  }
};