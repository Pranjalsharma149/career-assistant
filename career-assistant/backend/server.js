import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/jobs", jobRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Career Assistant Backend is running...");
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
