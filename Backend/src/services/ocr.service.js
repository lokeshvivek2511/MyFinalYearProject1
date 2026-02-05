import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { config } from "../config/env.js";

export const extractTextFromImage = async (imagePath) => {
  const formData = new FormData();

  formData.append(
    "instructions",
    JSON.stringify({
      parts: [{ file: "page" }],
      output: {
        type: "json-content",
        plainText: true,
        structuredText: true
      }
    })
  );

  formData.append("page", fs.createReadStream(imagePath));

  const response = await axios.post(
    "https://api.nutrient.io/build",
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${config.NUTRIENT_API_KEY}`
      }
    }
  );

  // Nutrient returns structured JSON
 const result = response.data;

// ✅ Extract ONLY plain text
if (result?.pages?.length && result.pages[0].plainText) {
  return result.pages[0].plainText;
}

throw new Error("No plain text extracted from OCR");


};