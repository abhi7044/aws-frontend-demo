// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../Navbar";

// const CreateRepo = () => {
//   const navigate = useNavigate();
//   const userId = localStorage.getItem("userId");

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [visibility, setVisibility] = useState(true); // true = public
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!name.trim()) {
//       setError("Repository name is required");
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post("http://localhost:3000/repo/create", {
//         name: name.trim(),
//         description: description.trim(),
//         visibility,
//         owner: userId,
//         content: [],
//         issues: [],
//       });
//       navigate("/"); // dashboard
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || "Could not create repository");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={{ maxWidth: 500, margin: "40px auto", color: "white" }}>
//         <h2>Create a new repository</h2>

//         <form onSubmit={handleSubmit}>
//           <label>Repository name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             style={{ display: "block", width: "100%", marginBottom: 16, padding: 8 }}
//           />

//           <label>Description (optional)</label>
//           <input
//             type="text"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             style={{ display: "block", width: "100%", marginBottom: 16, padding: 8 }}
//           />

//           <label>
//             <input
//               type="radio"
//               checked={visibility}
//               onChange={() => setVisibility(true)}
//             />{" "}
//             Public
//           </label>{" "}
//           <label>
//             <input
//               type="radio"
//               checked={!visibility}
//               onChange={() => setVisibility(false)}
//             />{" "}
//             Private
//           </label>

//           {error && <p style={{ color: "tomato" }}>{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             style={{ display: "block", marginTop: 20, padding: "8px 16px" }}
//           >
//             {loading ? "Creating..." : "Create repository"}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default CreateRepo;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./createRepo.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const NAME_REGEX = /^[A-Za-z0-9._-]+$/;

const CreateRepo = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [readme, setReadme] = useState(false);
  const [gitignore, setGitignore] = useState("none");
  const [license, setLicense] = useState("none");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    axios
  .get(`${API_URL}/user/userProfile/${userId}`)
  .then((res) => setUsername(res.data.username))
  .catch((err) => console.error("Cannot fetch user: ", err));
  }, [userId]);

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    username || "user"
  )}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
        await axios.post(
            `${API_URL}/repo/create`,
            {
                owner: userId,
                name: name,
                description: description,
                visibility: visibility === "public", // dropdown ki string ko true/false banao
                content: [],
                issues: [],
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        navigate("/"); // ya jahan bhejna ho
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Repository create nahi hui");
    }
};

  return (
    <>
      <Navbar />

      <form className="cr-wrap" onSubmit={handleSubmit}>
        <h1 className="cr-title">Create a new repository</h1>
        <p className="cr-sub">
          Repositories contain a project's files and version history.
        </p>
        <p className="cr-sub">
          <em>Required fields are marked with an asterisk (*).</em>
        </p>

        {/* Step 1: General */}
        <div className="cr-step">
          <div className="cr-rail">
            <div className="cr-num">1</div>
            <div className="cr-line" />
          </div>
          <div className="cr-body">
            <h2 className="cr-h">General</h2>

            <div className="cr-row">
              <div>
                <label className="cr-label">Owner *</label>
                <div className="cr-owner">
                  <img src={avatarUrl} alt="owner" />
                  {username || "..."}
                </div>
              </div>
              <span className="cr-slash">/</span>
              <div style={{ flex: 1 }}>
                <label className="cr-label" htmlFor="repo-name">
                  Repository name *
                </label>
                <input
                  id="repo-name"
                  className="cr-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <p className="cr-hint">
              Great repository names are short and memorable.
            </p>

            <label className="cr-label" htmlFor="repo-desc">
              Description
            </label>
            <input
              id="repo-desc"
              className="cr-input"
              maxLength={350}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="cr-count">{description.length} / 350 characters</div>
          </div>
        </div>

        {/* Step 2: Configuration */}
        <div className="cr-step">
          <div className="cr-rail">
            <div className="cr-num">2</div>
          </div>
          <div className="cr-body">
            <h2 className="cr-h">Configuration</h2>

            <div className="cr-card">
              <div className="cr-item">
                <div>
                  <div className="cr-item-t">Choose visibility *</div>
                  <div className="cr-item-d">
                    Choose who can see and commit to this repository
                  </div>
                </div>
                <select
                  className="cr-select"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            {/* <div className="cr-card">
              <div className="cr-item">
                <div>
                  <div className="cr-item-t">Add README</div>
                  <div className="cr-item-d">
                    READMEs can be used as longer descriptions.
                  </div>
                </div>
                <div className="cr-toggle">
                  {readme ? "On" : "Off"}
                  <div
                    className={`cr-switch ${readme ? "on" : ""}`}
                    onClick={() => setReadme(!readme)}
                    role="switch"
                    aria-checked={readme}
                  />
                </div>
              </div>

              <div className="cr-item">
                <div>
                  <div className="cr-item-t">Add .gitignore</div>
                  <div className="cr-item-d">
                    .gitignore tells git which files not to track.
                  </div>
                </div>
                <select
                  className="cr-select"
                  value={gitignore}
                  onChange={(e) => setGitignore(e.target.value)}
                >
                  <option value="none">No .gitignore</option>
                  <option value="node">Node</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div className="cr-item">
                <div>
                  <div className="cr-item-t">Add license</div>
                  <div className="cr-item-d">
                    Licenses explain how others can use your code.
                  </div>
                </div>
                <select
                  className="cr-select"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                >
                  <option value="none">No license</option>
                  <option value="mit">MIT License</option>
                  <option value="apache-2.0">Apache License 2.0</option>
                  <option value="gpl-3.0">GNU GPL v3</option>
                </select>
              </div>
            </div> */}

            {error && <div className="cr-err">{error}</div>}

            <div className="cr-actions">
              <button className="cr-btn" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create repository"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateRepo;