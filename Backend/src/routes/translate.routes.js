import express from "express";
import { translate } from "../controllers/translate.controller.js";

const router = express.Router();

router.post("/", translate);

export default router;