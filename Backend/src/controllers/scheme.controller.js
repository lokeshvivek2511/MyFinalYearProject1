import { getSchemeEligibility } from "../services/pythonApi.service.js";

export const getEligibleSchemes = async (req, res, next) => {
  try {
    const result = await getSchemeEligibility(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};