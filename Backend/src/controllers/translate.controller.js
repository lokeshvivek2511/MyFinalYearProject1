import { translateText } from "../services/gemini.service.js";

export const translate = async (req, res, next) => {
  try {
    const { text, language } = req.body;
    const translated = await translateText(text, language);
    res.json({ translated });
  } catch (err) {
    next(err);
  }
};