import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const navigate = useNavigate();
  
  const { setCurrentUser } = useAuth();
  const { id } = useParams();

  const loggedInUserId = localStorage.getItem("userId");
  const profileId = id || loggedInUserId;
  const isOwnProfile = profileId === loggedInUserId;

  const picKey = `profilePic_${loggedInUserId}`;

const [userDetails, setUserDetails] = useState({ username: "" });
const [profilePic, setProfilePic] = useState(localStorage.getItem(picKey) || "");

const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
  userDetails.username || "user"
)}`;

  
  

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!profileId) return;
      try {
        const response = await axios.get(
          `${API_URL}/user/userProfile/${profileId}`
        );
        setUserDetails(response.data);
      } catch (err) {
        console.error("Cannot fetch user details: ", err);
      }
    };

    fetchUserDetails();
  }, [profileId]);


  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Please choose an image smaller than 1 MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem(picKey, reader.result);
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Navbar />

      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item
          aria-current="page"
          icon={BookIcon}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item
          onClick={() => navigate("/starred")}
          icon={RepoIcon}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Starred Repositories
        </UnderlineNav.Item>
      </UnderlineNav>

      {/* {isOwnProfile && (
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setCurrentUser(null);
            window.location.href = "/auth";
          }}
          style={{ position: "fixed", bottom: "50px", right: "50px" }}
          id="logout"
        >
          Logout
        </button>
      )} */}


      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          {isOwnProfile ? (
  <label style={{ cursor: "pointer" }} title="Click to change photo">
    <img
      src={profilePic || avatarUrl}
      alt="Profile"
      className="profile-image"
    />
    <input
      type="file"
      accept="image/*"
      onChange={handlePicChange}
      style={{ display: "none" }}
    />
  </label>
) : (
  <img src={avatarUrl} alt="Profile" className="profile-image" />
)}

          <div className="name">
            <h3>{userDetails.username}</h3>
          </div>

          {/* <button className="follow-btn">Follow</button> */}
          {!isOwnProfile && <button className="follow-btn">Follow</button>}

          <div className="follower">
            <p>10 Follower</p>
            <p>3 Following</p>
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              // localStorage.removeItem("profilePic");
              setCurrentUser(null);
              window.location.href = "/auth";
            }}
          >
            Logout
          </button>
        </div>

        <div className="heat-map-section">
          <HeatMapProfile />
        </div>
      </div>
    </>
  );
};

export default Profile;
