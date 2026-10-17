import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import "./issue.css";

const API = "http://localhost:3000";

const IssuePage = () => {
  const { repoId } = useParams();
  const [repoName, setRepoName] = useState("");
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("open");
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    try {
      const res = await fetch(`${API}/issue/repo/${repoId}`);
      if (!res.ok) {
        setIssues([]);
        return;
      }
      const data = await res.json();
      setIssues(data.issues || []);
    } catch (err) {
      console.error("Error fetching issues: ", err);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRepoName = async () => {
      try {
        const res = await fetch(`${API}/repo/${repoId}`);
        if (!res.ok) return;
        const data = await res.json();
        const repo = data.repository || data;
        setRepoName(repo.name || "");
      } catch (err) {
        console.error("Error fetching repo: ", err);
      }
    };

    fetchRepoName();
    fetchIssues();
    // eslint-disable-next-line
  }, [repoId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API}/issue/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, repository: repoId }),
      });
      if (!res.ok) {
        alert("Issue create nahi hua");
        return;
      }
      setTitle("");
      setDescription("");
      setFilter("open");
      fetchIssues();
    } catch (err) {
      console.error("Error creating issue: ", err);
    }
  };

  const handleToggle = async (issue) => {
    const newStatus = issue.status === "open" ? "closed" : "open";
    try {
      const res = await fetch(`${API}/issue/update/${issue._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchIssues();
    } catch (err) {
      console.error("Error updating issue: ", err);
    }
  };

  const handleDelete = async (issueId) => {
    if (!window.confirm("Is issue ko delete karna hai?")) return;
    try {
      const res = await fetch(`${API}/issue/delete/${issueId}`, {
        method: "DELETE",
      });
      if (res.ok) fetchIssues();
    } catch (err) {
      console.error("Error deleting issue: ", err);
    }
  };

  const openCount = issues.filter((i) => i.status === "open").length;
  const closedCount = issues.filter((i) => i.status === "closed").length;
  const shown = issues.filter((i) => i.status === filter);

  return (
    <>
      <Navbar />
      <div className="issue-page">
        <h2>Issues{repoName && ` · ${repoName}`}</h2>

        <form className="issue-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Issue title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description (optional)"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" className="issue-btn-primary">
            New issue
          </button>
        </form>

        <div className="issue-tabs">
          <button
            className={filter === "open" ? "active" : ""}
            onClick={() => setFilter("open")}
          >
            Open ({openCount})
          </button>
          <button
            className={filter === "closed" ? "active" : ""}
            onClick={() => setFilter("closed")}
          >
            Closed ({closedCount})
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {!loading && shown.length === 0 && (
          <p className="issue-empty">No {filter} issues.</p>
        )}

        {shown.map((issue) => (
          <div className="issue-card" key={issue._id}>
            <div>
              <h4>{issue.title}</h4>
              {issue.description && <p>{issue.description}</p>}
            </div>
            <div className="issue-actions">
              <button onClick={() => handleToggle(issue)}>
                {issue.status === "open" ? "Close" : "Reopen"}
              </button>
              <button onClick={() => handleDelete(issue._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default IssuePage;