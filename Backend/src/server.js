import app from "./app.js";
import connectDB from "./config/db.js";
import { config } from "./config/env.js";

// Connect to MongoDB
connectDB();

// Start server
const PORT = config.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});