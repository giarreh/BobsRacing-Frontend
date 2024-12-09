import React, { useState } from "react";
import "./ProfilePage.css"; // Ensure the CSS is linked correctly

const ProfilePage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("general");
  const [sidebarOpen, setSidebarOpen] = useState(false); // To track sidebar open/close state
  const [backButtonVisible, setBackButtonVisible] = useState(false); // To track if the back button should be visible

  // Fetch the current loggedin user

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

  return (
    <div className="profile-page">
      {/* Hamburger Icon (visible on mobile) */}
      <div className="hamburger-icon" onClick={toggleSidebar}>
        ☰
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Back Button (visible only on mobile when sidebar is open) */}
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
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {selectedTab === "general" ? (
          <div className="general-content">
            <h2>General Information</h2>
            <p>This is the general information section.</p>
            {/* Add more content here */}
          </div>
        ) : (
          <div className="settings-content">
            <h2>Settings</h2>
            <p>This is the settings section.</p>
            {/* Add more content here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
