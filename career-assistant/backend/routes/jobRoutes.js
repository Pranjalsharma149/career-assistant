import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Path to JSON file
const dataPath = path.join(process.cwd(), "data", "questions.json");

// Get all questions
router.get("/", (req, res) => {
  try {
    const file = fs.readFileSync(dataPath, "utf8");
    const questions = JSON.parse(file);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error reading questions." });
  }
});

export default router;
