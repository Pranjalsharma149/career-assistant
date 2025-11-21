const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Home route for testing
app.get("/", (req, res) => {
  res.send("Career Skill Gap Backend is running!");
});

// Predefined skills for each role
const skillsDB = {
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Git"],
  "Backend Developer": ["Java", "Spring Boot", "SQL", "APIs", "Git"],
  "Data Analyst": ["Excel", "SQL", "Python", "Dashboards", "Statistics"],
};

// Skill Gap Analyzer API
app.post("/api/skill-gap", (req, res) => {
  const { targetRole, currentSkills } = req.body;
  const requiredSkills = skillsDB[targetRole] || [];

  const matched = requiredSkills.filter((skill) => currentSkills.includes(skill));
  const missing = requiredSkills.filter((skill) => !currentSkills.includes(skill));
  const recommendations = missing; // simple recommendation logic
  const suggestedOrder = missing; // order to learn missing skills

  res.json({ matched, missing, recommendations, suggestedOrder });
});

// Career Roadmap Generator API
app.post("/api/roadmap", (req, res) => {
  const { targetRole } = req.body;

  const roadmap = {
    "Frontend Developer": [
      { name: "Phase 1 (1-2 months)", tasks: ["HTML", "CSS", "JavaScript"] },
      { name: "Phase 2 (2 months)", tasks: ["React", "Git", "Responsive Design"] },
      { name: "Phase 3 (1-2 months)", tasks: ["Projects", "Portfolio", "Deployment"] }
    ],
    "Backend Developer": [
      { name: "Phase 1 (1-2 months)", tasks: ["Java basics", "OOP", "Git"] },
      { name: "Phase 2 (2 months)", tasks: ["Spring Boot", "SQL", "APIs"] },
      { name: "Phase 3 (1-2 months)", tasks: ["Deployment", "Projects", "System Design"] }
    ],
    "Data Analyst": [
      { name: "Phase 1 (1-2 months)", tasks: ["Excel", "SQL", "Python basics"] },
      { name: "Phase 2 (2 months)", tasks: ["Dashboards", "Statistics", "Data Cleaning"] },
      { name: "Phase 3 (1-2 months)", tasks: ["Projects", "Portfolio", "Visualization"] }
    ]
  };

  res.json({ phases: roadmap[targetRole] || [] });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
