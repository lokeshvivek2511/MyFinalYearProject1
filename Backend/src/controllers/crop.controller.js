import { getCropRecommendation } from "../services/pythonApi.service.js";

export const recommendCrop = async (req, res, next) => {
  try {
    const {
      Nitrogen,
      Phosphorus,
      Potassium,
      Temperature,
      Humidity,
      Rainfall,
      pH
    } = req.body;

    // minimal validation
    if (
      Temperature === undefined ||
      Humidity === undefined ||
      Rainfall === undefined
    ) {
      return res.status(400).json({
        message: "Weather values are required"
      });
    }

    const payload = {
      Nitrogen,
      Phosphorus,
      Potassium,
      Temperature,
      Humidity,
      Rainfall,
      pH
    };

    const result = await getCropRecommendation(payload);

    res.json(result);
  } catch (err) {
    next(err);
  }
};