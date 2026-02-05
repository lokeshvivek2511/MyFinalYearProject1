import express from "express";
import multer from "multer";
import { extractSoilReportStructured } from "../controllers/ocr.controller.js";

const upload = multer({ dest: "src/uploads/" });
const router = express.Router();


router.post(
  "/soil-report-structured",
  upload.single("image"),
  extractSoilReportStructured
);
export default router;