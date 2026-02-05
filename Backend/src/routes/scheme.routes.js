import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getEligibleSchemes } from "../controllers/scheme.controller.js";

const router = express.Router();

router.post("/eligible", authMiddleware, getEligibleSchemes);

export default router;