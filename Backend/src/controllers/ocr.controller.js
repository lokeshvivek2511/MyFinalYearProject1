// import { extractTextFromImage } from "../services/ocr.service.js";
// import { extractSoilValues } from "../services/gemini.service.js";
// import { parseSoilValues } from "../utils/soilParser.js";

// export const extractSoilReportStructured = async (req, res, next) => {
//   try {
//     const rawText = await extractTextFromImage(req.file.path);

//     const cleanedText = rawText
//       .replace(/\s+/g, " ")
//       .toLowerCase();

//     // ✅ 1. Rule-based extraction FIRST
//     const ruleBased = parseSoilValues(cleanedText);

//     // If at least one value found, trust rule-based
//     const hasAny =
//       ruleBased.ph !== null ||
//       ruleBased.phosphorus !== null ||
//       ruleBased.potassium !== null ||
//       ruleBased.nitrogen !== null;

//     if (hasAny) {
//       return res.json({
//         source: "rule-based",
//         rawText,
//         extractedValues: ruleBased
//       });
//     }

//     // ✅ 2. Fallback to Gemini ONLY if rules fail
//     const aiValues = await extractSoilValues(cleanedText);

//     res.json({
//       source: "gemini",
//       rawText,
//       extractedValues: aiValues
//     });
//   } catch (err) {
//     next(err);
//   }
// };

import { extractSoilValuesFromImage } from "../services/gemini.service.js";

export const extractSoilReportStructured = async (req, res, next) => {
  try {
    const soilData = await extractSoilValuesFromImage(req.file.path);

    res.json({
      source: "gemini-vision",
      extractedValues: soilData
    });
  } catch (err) {
    next(err);
  }
};