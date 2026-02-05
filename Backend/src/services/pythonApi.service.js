import axios from "axios";
import { config } from "../config/env.js";

export const getCropRecommendation = async (payload) => {
  const response = await axios.post(
    config.PYTHON_CROP_API_URL,
    payload
  );
  return response.data;
};

export const getSchemeEligibility = async (payload) => {
  const response = await axios.post(
    config.PYTHON_SCHEME_API_URL,
    payload
  );
  return response.data;
};