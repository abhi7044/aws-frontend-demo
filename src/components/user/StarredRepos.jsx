import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";

const API_URL = import.meta.env.VITE_API_URL;

const StarredRepos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchStarred = async () => {
      try {
        const res = await fetch(`${API_URL}/user/starred/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setRepos(data.starRepos || []);
        }
      } catch (err) {
        console.error("Error fetching starred repos: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStarred();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px", color: "#f1f6fd" }}>
        <h2 style={{ marginBottom: "16px" }}>Starred Repositories</h2>

        {loading && <p>Loading...</p>}
        {!loading && repos.length === 0 && <p>Abhi koi repo star nahi ki.</p>}

        {repos.map((repo) => (
          <div
            key={repo._id}
            style={{
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "14px",
              marginBottom: "12px",
            }}
          >
            <h4 style={{ color: "#408ced" }}>{repo.name}</h4>
            <p style={{ color: "#8b949e" }}>{repo.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default StarredRepos;