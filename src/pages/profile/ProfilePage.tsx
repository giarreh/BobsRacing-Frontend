import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { User } from "../../interfaces/IUser";
import { useLocation } from "react-router-dom";

import "./ProfilePage.css";
import { Race } from "../../interfaces/IRace";

export default function ProfilePage() {
  const navigate = useNavigate();
  //const { id } = useParams();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(location.state?.tab || "general");
  const [sidebarOpen, setSidebarOpen] = useState(false); // To track sidebar open/close state
  const [hamburgerIcon, setHamburgerIcon] = useState(true);
  const [backButtonVisible, setBackButtonVisible] = useState(false); // To track if the back button should be visible
  const [race, setRace] = useState<Race | null>(null);

  // Fetch the current loggedin user
  const { user, getAuthToken } = useContext(UserContext);

  const [userEdit, setUser] = useState<User>({
    profilename: user?.profilename,
    username: user?.username,
  });

  const [bets, setBets] = useState<Bet[]>([]);
  const [raceDetails, setRaceDetails] = useState<{
    [key: string]: Race | undefined;
  }>({});
  const [activeBets, setActiveBets] = useState([]);
  const [finishedBets, setFinishedBets] = useState([]);
  const [loadingBets, setLoadingBets] = useState(false);

  // Fetch Bet History when selectedTab is 'bet-history'
  useEffect(() => {
    if (selectedTab === "bet-history") {
      fetchBetHistory();
    }
  }, [selectedTab]);

  // Fetch Race Details when Bets are updated
  useEffect(() => {
    if (bets.length > 0) {
      fetchRaceDetailsForBets();
    }
  }, [bets]);

const fetchRaceDetailsForBets = async () => {
  const updatedRaceDetails: { [key: string]: Race } = {};
  await Promise.all(
    bets.map(async (bet) => {
      try {
        const response = await fetch(
          `https://localhost:7181/api/RaceAthlete/${bet.raceAthleteId}`,
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error for Bet ID ${bet.betId}`);
        }
        const raceAthlete: Race = await response.json();
        const raceId = raceAthlete.raceId;

        const raceResponse = await fetch(
          `https://localhost:7181/api/Race/${raceId}`,
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!raceResponse.ok) {
          throw new Error(`HTTP error fetching race for raceId ${raceId}`);
        }

        const raceData: Race = await raceResponse.json();
        updatedRaceDetails[bet.betId] = raceData;
      } catch (error) {
        console.error(
          `Error fetching race details for Bet ID ${bet.betId}:`,
          error
        );
      }
    })
  );

  setRaceDetails((prev) => ({ ...prev, ...updatedRaceDetails }));
};


  const fetchBetHistory = async () => {
    setLoadingBets(true);
    try {
      const response = await fetch(
        `https://localhost:7181/api/User/bets?id=${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      // Split active and finished bets
      const active = data.bets.filter((bet) => bet.isActive);
      const finished = data.bets.filter((bet) => !bet.isActive);

      setBets(data.bets);
      setActiveBets(active);
      setFinishedBets(finished);
    } catch (error) {
      console.error("Error fetching bet history:", error);
    } finally {
      setLoadingBets(false);
    }
  };

  // Function to handle tab selection
  const handleTabSelect = (tab: string) => {
    setSelectedTab(tab);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false); // Close the sidebar when an item is selected on mobile
      setBackButtonVisible(false); // Hide back button when item is selected
      setHamburgerIcon(true);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Toggle sidebar visibility (for mobile)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setBackButtonVisible(true); // Show back button when hamburger menu is clicked
    setHamburgerIcon(false);
  };

  // Function to handle back button click
  const handleBackButtonClick = () => {
    setSidebarOpen(false);
    setBackButtonVisible(false);
    setHamburgerIcon(true);
  };

  // Handle submissions
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all fields are valid
    if (userEdit.profilename === "" && userEdit.username === "") {
      return alert("Please fill out a field");
    }

    try {
      console.log(JSON.stringify(userEdit));
      console.log(user?.id);
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
            console.log("sadasda" + JSON.stringify(userEdit));
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        })
        .then((data) => {
          console.log("Success: Profile updated", data);
          alert("Profile updated successfully");
        });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Unknown date";

    const date = new Date(dateString);

    // Format date as DD.MM.YYYY
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };


  return (
    <div className="profile-page">
      {/* Sidebar */}
      <div className="sidebar-container">
        {hamburgerIcon && (
          <div className="hamburger-icon" onClick={toggleSidebar}>
            ☰
          </div>
        )}

        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
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
      </div>

      {/* Main Content */}
      <div className="main-content">
        {selectedTab === "general" && (
          <div className="general-content">
            <h2>General Information</h2>
            <label className="profile-label">
              <strong>Display name: </strong>
              <div>{user?.profilename}</div>
            </label>
            <label className="profile-label">
              <strong>Username: </strong>
              <div>{user?.username}</div>
            </label>
            <label className="profile-label">
              <strong>Credits: </strong>
              <div>{user?.credits}</div>
            </label>
          </div>
        )}

        {selectedTab === "settings" && (
          <form className="settings-content" onSubmit={handleEdit}>
            <h2>Settings</h2>
            <label>Display Name: </label>
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
        )}

        {selectedTab === "bet-history" && (
          <div className="bet-history-container">
            <div className="bet-history-card">
              <h2 className="bet-history-title">Bet History</h2>
              {loadingBets ? (
                <p className="bet-history-loading">Loading bet history...</p>
              ) : (
                <>
                  <div className="bet-section">
                    <h3 className="bet-section-title">Active Bets</h3>
                    {activeBets.length > 0 ? (
                      <ul className="bet-list">
                        {activeBets.map((bet) => {
                          const race = raceDetails[bet.betId]; // Get race details for this bet

                          return (
                            <li key={bet.betId} className="bet-item-active">
                              <span>
                                <strong>Race ID: </strong>
                                {race?.raceId || "Loading..."}{" "}
                              </span>
                              <span>
                                <strong>Date:</strong>{" "}
                                {race?.date
                                  ? formatDate(race?.date?.toLocaleString())
                                  : "Loading..."}
                              </span>
                              <span>
                                <span>
                                  <strong>Bet on: {bet.athleteName}</strong>:{" "}
                                </span>
                                <span className="bet-amount">
                                  {bet.amount.toFixed(2)} credits
                                </span>
                              </span>
                              <span>
                                <span>
                                  <strong>Potential Payout: </strong>
                                </span>
                                <span className="bet-payout">
                                  {bet.potentialPayout.toFixed(2)} credits
                                </span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="no-bets">No active bets</p>
                    )}
                  </div>

                  <div className="bet-section">
                    <h3 className="bet-section-title">Finished Bets</h3>
                    {finishedBets.length > 0 ? (
                      <ul className="bet-list">
                        {finishedBets.map((bet) => {
                          const race = raceDetails[bet.betId]; // Get race details for this bet

                          return (
                            <li
                              key={bet.betId}
                              className={`bet-item-finished ${
                                bet.isWin ? "bet-win" : "bet-lose"
                              }`}
                            >
                              {" "}
                              <span className="result-line">
                                <span><strong>Result: </strong>
                                </span>
                                <span className={bet.isWin ? "win" : "loss"}>
                                  {" "}
                                  {bet.isWin ? "WIN" : "LOSS"}
                                </span>
                              </span>
                              <span className="">
                                <span>
                                  <strong>Race ID: </strong>
                                  {race?.raceId || "Loading..."}{" "}
                                </span>
                                <span>
                                  <strong>Date:</strong>{" "}
                                  {race?.date
                                    ? formatDate(race?.date?.toLocaleString())
                                    : "Loading..."}
                                </span>
                              </span>
                              <span>
                                <span>
                                  <strong>Bet on: {bet.athleteName}</strong>:{" "}
                                </span>
                                <span className="bet-amount">
                                  {bet.amount.toFixed(2)} credits
                                </span>
                              </span>
                              <span>
                                <span>
                                  <strong>Potential Payout: </strong>
                                </span>
                                <span className="bet-payout">
                                  {bet.potentialPayout.toFixed(2)} credits
                                </span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="no-bets">No finished bets</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
