"use client";

import { useState, useEffect } from "react";
// Assuming API is correctly configured to point to localhost:5000
import API from "../services/api"; 

// Helper function to format Unix timestamp to a readable time
const formatTime = (unixTime: number) => {
    if (!unixTime) return 'N/A';
    return new Date(unixTime * 1000).toLocaleString();
};

export default function HomePage() {
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState("");
  const [skillGapResult, setSkillGapResult] = useState<any>(null);
  const [roadmapResult, setRoadmapResult] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Normalizes the input role to match the keys in the backend's skillsDB
  const normalizeRole = (role: string) => {
    role = role.trim().toLowerCase();
    if (role.includes("frontend")) return "Frontend Developer";
    if (role.includes("backend")) return "Backend Developer";
    if (role.includes("data")) return "Data Analyst";
    return role;
  };

  const handleSubmit = async () => {
    if (!targetRole || !skills) return;

    const normalizedRole = normalizeRole(targetRole);

    try {
      setLoading(true);
      
      // 1. Skill Gap Analysis
      const skillRes = await API.post("/api/skill-gap", {
        targetRole: normalizedRole,
        // FIX: Sending the raw skills string. The backend is responsible for splitting and cleaning.
        currentSkills: skills, 
      });
      setSkillGapResult(skillRes.data);

      // 2. Career Roadmap Generation
      const roadmapRes = await API.post("/api/roadmap", {
        targetRole: normalizedRole,
      });
      setRoadmapResult(roadmapRes.data);

    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // FIX: Calling the custom backend route for HackerNews integration
        const res = await API.get("/api/news"); 
        setStories(res.data);
      } catch (err) {
        console.error("Failed to fetch stories from backend:", err);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Career Assistant</h1>

      {/* Form - Structured and Usable */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center">
        <input
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3"
          placeholder="Target Role (e.g., Backend Developer)"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/2"
          placeholder="Current Skills (e.g., HTML, CSS, React)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze My Career Path"}
        </button>
      </div>

      {/* Dashboard - Layout requirement: Left side -> Skill Gap, Right side -> Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT SIDE: Skill Gap */}
        <div className="bg-white shadow-md p-4 rounded-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-3 text-blue-800">🎯 Skill Gap Analysis</h2>
          {skillGapResult ? (
            <div className="space-y-3 text-sm">
              <p>
                <strong>✅ Matched Skills:</strong>{" "}
                <span className="text-green-600 font-medium">
                  {skillGapResult.matched.join(", ") || "None"}
                </span>
              </p>
              <p>
                <strong>❌ Missing Skills:</strong>{" "}
                <span className="text-red-600 font-medium">
                  {skillGapResult.missing.join(", ") || "None"}
                </span>
              </p>
              <p>
                <strong>💡 Recommendations:</strong>{" "}
                {skillGapResult.recommendations.join(", ") || "None"}
              </p>
              <p>
                <strong>📚 Suggested Learning Order:</strong>{" "}
                {skillGapResult.suggestedOrder.join(", ") || "None"}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Enter role and skills to analyze your gap.</p>
          )}
        </div>

        {/* RIGHT SIDE: Career Roadmap */}
        <div className="bg-white shadow-md p-4 rounded-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-3 text-blue-800">🗺️ Career Roadmap</h2>
          {roadmapResult && roadmapResult.phases.length > 0 ? (
            roadmapResult.phases.map((phase: any, idx: number) => (
              <div key={idx} className="mb-4 p-3 border-l-4 border-yellow-500 bg-yellow-50">
                <h3 className="font-bold text-base">{phase.name}</h3>
                <ul className="list-disc list-inside ml-2 mt-1 text-sm">
                  {phase.tasks.map((task: string, tIdx: number) => (
                    <li key={tIdx}>{task}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No roadmap available. Click 'Analyze My Career Path' to generate.</p>
          )}
        </div>
      </div>
      
      {/* Horizontal Rule to separate sections */}
      <hr className="my-6" />

      {/* BOTTOM SECTION: HackerNews */}
      <div className="bg-white shadow-md p-4 rounded-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          📰 Latest Tech News (HackerNews Top 5)
        </h2>
        {stories.length > 0 ? (
          <ul className="list-disc list-inside space-y-2">
            {stories.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url || `https://news.ycombinator.com/item?id=${s.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {s.title}
                </a>{" "}
                <span className="text-gray-600 text-sm">
                  (Score: {s.score}, By: {s.by}, Type: {s.type}, Time: {formatTime(s.time)})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Loading stories...</p>
        )}
      </div>
    </div>
  );
}