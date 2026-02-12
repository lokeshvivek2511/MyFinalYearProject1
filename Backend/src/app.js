import express from "express";
import cors from "cors";
import morgan from "morgan";

import errorHandler from "./middlewares/error.middleware.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import questionRoutes from "./routes/question.routes.js";
import answerRoutes from "./routes/answer.routes.js";
import cropRoutes from "./routes/crop.routes.js";
import schemeRoutes from "./routes/scheme.routes.js";
import ocrRoutes from "./routes/ocr.routes.js";
import translateRoutes from "./routes/translate.routes.js";
import weatherRoutes from "./routes/weather.routes.js";

const app = express();

// ------------------ GLOBAL MIDDLEWARES ------------------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ------------------ API ROUTES ------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/weather", weatherRoutes);

// ------------------ ERROR HANDLER ------------------
app.use(errorHandler);

export default app;