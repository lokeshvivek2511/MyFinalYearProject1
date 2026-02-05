import axios from "axios";
import { config } from "../config/env.js";
import fs from "fs";

export const extractSoilValuesFromImage = async (imagePath) => {
  const imageBase64 = fs.readFileSync(imagePath, {
    encoding: "base64"
  });

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${config.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            {
              text: `
You are reading a soil test report image.

Extract ONLY these values if present:
- nitrogen
- phosphorus
- potassium
- ph

Rules:
- Return ONLY valid JSON
- Use numbers only
- If a value is missing, return null
- Do not add explanations or markdown

Example output:
{"nitrogen": null, "phosphorus": 41, "potassium": 193, "ph": 9.7}
              `
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.0,
        maxOutputTokens: 200
      }
    }
  );

  const raw = response.data.candidates[0].content.parts[0].text;

  // safety extraction (in case of noise)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Gemini Vision did not return valid JSON");
  }

  return JSON.parse(jsonMatch[0]);
};

export const translateText = async (text, targetLanguage) => {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            {
              text: `Translate the following text to ${targetLanguage}. Return only the translated text.\n\n${text}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.0,
        maxOutputTokens: 500
      }
    }
  );

  return response.data.candidates[0].content.parts[0].text;
};


// export const extractSoilValues = async (ocrText) => {
//   const response = await axios.post(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.GEMINI_API_KEY}`,
//     {
//       contents: [
//         {
//           parts: [
//             {
//               text: `
// Extract soil values from the text below.

// Return ONLY a JSON object with EXACT keys:
// {
//   "nitrogen": number | null,
//   "phosphorus": number | null,
//   "potassium": number | null,
//   "ph": number | null
// }

// No markdown.
// No explanation.
// No extra text.

// TEXT:
// ${ocrText}
//               `
//             }
//           ]
//         }
//       ],
//       generationConfig: {
//         temperature: 0.0,
//         maxOutputTokens: 300
//       }
//     }
//   );
//   console.log("ocr text:==>"+ocrText);

//   const raw = response.data.candidates[0].content.parts[0].text;
//   console.log(raw);
//   // 🛡️ SAFE JSON EXTRACTION
//   const jsonMatch = raw.match(/\{[\s\S]*\}/);

//   if (!jsonMatch) {
//     throw new Error("Gemini did not return valid JSON");
//   }

//   return JSON.parse(jsonMatch[0]);
// };