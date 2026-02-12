import express from "express";
import { fetchWeather } from "../controllers/weather.controller.js";

const router = express.Router();

// GET /api/weather?city=Chennai
router.get("/", fetchWeather);

export default router;