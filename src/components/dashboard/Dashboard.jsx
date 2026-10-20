import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setsearchResults] = useState([]);
  const [starredIds, setStarredIds] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repo/user/${userId}`,
        );
        if (!response.ok) {
          setRepositories([]);
          return;
        }
        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
        setRepositories([]);
      }
    };

    const fetchStarred = async () => {
      try {
        const res = await fetch(`http://localhost:3000/user/starred/${userId}`);
        if (!res.ok) return;
        const data = await res.json();
        setStarredIds((data.starRepos || []).map((r) => r._id));
      } catch (err) {
        console.error("Error fetching starred repos: ", err);
      }
    };
    fetchStarred();

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        if (!response.ok) {
          setSuggestedRepositories([]);
          return;
        }
        const data = await response.json();
        setSuggestedRepositories(
          Array.isArray(data) ? data : data.repositories || [],
        );
      } catch (err) {
        setSuggestedRepositories([]);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery == "") {
      setsearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setsearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  const handleStar = async (repoId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/user/star/${userId}/${repoId}`,
        { method: "POST" },
      );
      if (!res.ok) return;
      const data = await res.json();
      setStarredIds((data.starRepos || []).map((id) => id.toString()));
    } catch (err) {
      console.error("Error while starring: ", err);
    }
  };

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside>
          <h3>Suggeste Repositories</h3>
          {suggestedRepositories.map((repo) => (
            <div key={repo._id} className="repo-row">
              <div>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
              <button
                className={`star-btn ${starredIds.includes(repo._id) ? "starred" : ""}`}
                onClick={() => handleStar(repo._id)}
                title="Star"
              >
                {starredIds.includes(repo._id) ? "★" : "☆"}
              </button>
            </div>
          ))}
        </aside>
        <main>
          <h2>Your Repositories</h2>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchResults.map((repo) => (
            <div key={repo._id} className="repo-row">
              <div>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
              <button
                className="issues-btn"
                onClick={() => navigate(`/issues/${repo._id}`)}
              >
                Issues
              </button>
            </div>
          ))}
        </main>
        <aside>
          <h3>Upcomming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
