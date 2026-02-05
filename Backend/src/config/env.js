import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,

  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,
  NUTRIENT_API_KEY: process.env.NUTRIENT_API_KEY,

  PYTHON_CROP_API_URL: process.env.PYTHON_CROP_API_URL,
  PYTHON_SCHEME_API_URL: process.env.PYTHON_SCHEME_API_URL,

  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
};