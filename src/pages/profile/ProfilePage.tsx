import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { User } from "../../interfaces/IUser";

import "./ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("general");
  const [sidebarOpen, setSidebarOpen] = useState(false); // To track sidebar open/close state
  const [backButtonVisible, setBackButtonVisible] = useState(false); // To track if the back button should be visible

  // Fetch the current loggedin user
  const { getAuthToken } = useContext(UserContext);

  const { user, getUserFromToken } = useContext(UserContext);

  const [userEdit, setUser] = useState<User>({
    id: 0,
    profilename: "",
    username: user?.username,
    credits: 0,
    role: "User",
  });

  // Function to handle tab selection
  const handleTabSelect = (tab: string) => {
    setSelectedTab(tab);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false); // Close the sidebar when an item is selected on mobile
      setBackButtonVisible(false); // Hide back button when item is selected
    }
  };

  // Toggle sidebar visibility (for mobile)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setBackButtonVisible(true); // Show back button when hamburger menu is clicked
  };

  // Function to handle back button click
  const handleBackButtonClick = () => {
    setSidebarOpen(false);
    setBackButtonVisible(false);
  };

  // Handle submissions

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all fields are valid
    if (userEdit.profilename === "") {
      return alert("Please fill out all fields correctly");
    }

    if (userEdit.username === "") {
      return alert("Please fill out all fields correctly");
    }

    try {
      fetch(`https://localhost:7181/api/User/${user?.id}/credentials`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userEdit),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        })
        .then((data) => {
          console.log("Success: Athlete updated", data);
          alert("Athlete updated successfully");
          navigate("/profile");
        });
    } catch (error) {
      console.error("Error updating athlete:", error);
      alert("Error updating athlete");
    }
  };

  return (
    <>
      <div className="profile-page">
        {/* Hamburger Icon on small screen */}
        <div className="hamburger-icon" onClick={toggleSidebar}>
          ☰
        </div>

        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          {/* Back Button on small screen */}
          {backButtonVisible && (
            <button className="back-button" onClick={handleBackButtonClick}>
              &#8592; Back
            </button>
          )}
          <ul>
            <li
              className={selectedTab === "general" ? "active" : ""}
              onClick={() => handleTabSelect("general")}
            >
              General
            </li>
            <li
              className={selectedTab === "settings" ? "active" : ""}
              onClick={() => handleTabSelect("settings")}
            >
              Settings
            </li>

            <li
              className={selectedTab === "bet-history" ? "active" : ""}
              onClick={() => handleTabSelect("bet-history")}
            >
              Bet History
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {selectedTab === "general" ? (
            <div className="general-content">
              <h2>General Information</h2>
              <label className="profile-label">
                <strong>Display name: </strong>
                <input type="text" name="firstName" value={user?.profilename} />
              </label>
              <label className="profile-label">
                <strong>Username: </strong>
                <input type="text" name="username" value={user?.username} />
              </label>
              <label className="profile-label">
                <strong>Credits: </strong>
                <input type="text" name="credits" value={user?.credits} />
              </label>
            </div>
          ) : selectedTab === "settings" ? (
            <div className="settings-content">
              <form onSubmit={handleEdit}>
                <label>Name: </label>
                <input
                  type="text"
                  placeholder={user?.profilename}
                  value={userEdit.profilename}
                  onChange={(e) =>
                    setUser({ ...userEdit, profilename: e.target.value })
                  }
                />
                <label>Username: </label>
                <input
                  type="text"
                  placeholder={user?.username}
                  value={userEdit.username}
                  onChange={(e) =>
                    setUser({ ...userEdit, username: e.target.value })
                  }
                />

                <button type="submit">Update Profile Information</button>
              </form>
            </div>
          ) : (
            <div className="bet-history-content">
              <h2>Bet History</h2>
              <p>This is the Bet History</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
