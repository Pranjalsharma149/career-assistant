import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Skill Gap Analyzer API
export const getSkillGap = (targetRole: string, currentSkills: string[]) => {
  return API.post("/api/skill-gap", { targetRole, currentSkills });
};

// Career Roadmap API
export const getRoadmap = (targetRole: string) => {
  return API.post("/api/roadmap", { targetRole });
};

export default API; // optional if you want to export the axios instance
