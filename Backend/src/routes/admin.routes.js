import express from "express";
import { adminLogin, approveExpert } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/approve-expert/:userId", approveExpert);

export default router;