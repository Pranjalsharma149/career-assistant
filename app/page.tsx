"use client"; // <- Important! Make this a client component

import { useState, useEffect } from "react";
import { getSkillGap, getRoadmap } from "../services/api";

export default function HomePage() {
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState("");
  const [skillGapResult, setSkillGapResult] = useState<any>(null);
  const [roadmapResult, setRoadmapResult] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);

  // Fetch top 5 HackerNews stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const ids = await res.json();
        const top5 = ids.slice(0, 5);

        const storyDetails = await Promise.all(
          top5.map(async (id: number) => {
            const storyRes = await fetch(
              `https://hacker-news.firebaseio.com/v0/item/${id}.json`
            );
            return storyRes.json();
          })
        );

        setStories(storyDetails);
      } catch (err) {
        console.error("Failed to fetch HackerNews stories", err);
      }
    };

    fetchStories();
  }, []);

  const handleSubmit = async () => {
    if (!targetRole || !skills) return;

    const currentSkills = skills.split(",").map((s) => s.trim());

    try {
      const skillRes = await getSkillGap(targetRole, currentSkills);
      setSkillGapResult(skillRes.data);

      const roadmapRes = await getRoadmap(targetRole);
      setRoadmapResult(roadmapRes.data);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Career Assistant</h1>

      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Target Role"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          placeholder="Current Skills (comma-separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <button onClick={handleSubmit} style={{ marginLeft: "10px" }}>
          Analyze My Career Path
        </button>
      </div>

      {skillGapResult && (
        <div>
          <h2>Skill Gap Result:</h2>
          <pre>{JSON.stringify(skillGapResult, null, 2)}</pre>
        </div>
      )}

      {roadmapResult && (
        <div>
          <h2>Career Roadmap:</h2>
          <pre>{JSON.stringify(roadmapResult, null, 2)}</pre>
        </div>
      )}

      {stories.length > 0 && (
        <div>
          <h2>Latest Tech News (HackerNews Top 5):</h2>
          <ul>
            {stories.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.title}
                </a>{" "}
                (By: {s.by}, Score: {s.score})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
