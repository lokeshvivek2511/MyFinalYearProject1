import { getCropRecommendation } from "../services/pythonApi.service.js";

export const recommendCrop = async (req, res, next) => {
  try {
    const result = await getCropRecommendation(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};