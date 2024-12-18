import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Race } from "../../interfaces/IRace";
import { useNavigate } from "react-router-dom";
import "./BetPage.css";

const BettingPage = () => {
  const { user, setUser, getAuthToken } = useContext(UserContext);
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
  const [odds, setOdds] = useState([]);
  const [bet, setBet] = useState({ amount: "", raceAthleteId: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch("https://localhost:7181/api/Race", {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Only show unfinished races to bet on
        const unfinishedRaces = data.filter((race: Race) => !race.isFinished);
        const sortedRaces = unfinishedRaces.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setRaces(sortedRaces);
      } catch (error) {
        console.error("Error fetching races:", error);
      }
    };

    fetchRaces();
  }, [getAuthToken]);

  const fetchOdds = async (raceId: number) => {
    if (selectedRaceId === raceId) {
      setSelectedRaceId(null);
      setBet((prevBet) => ({ ...prevBet, raceAthleteId: "" }));
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7181/api/Race/${raceId}/odds`,
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
      setOdds(data);
      setSelectedRaceId(raceId);
    } catch (error) {
      console.error("Error fetching odds:", error);
    }
  };

  const placeBet = async () => {
    const selectedAthlete = odds.find(
      (o: any) => o.raceAthleteId === parseInt(bet.raceAthleteId)
    );
    if (!selectedAthlete) {
      alert("Invalid athlete selected");
      return;
    }

    const potentialPayout = (bet.amount * selectedAthlete.odds).toFixed(2);

    const betData = {
      amount: parseFloat(bet.amount),
      potentialPayout: parseFloat(potentialPayout),
      isActive: true,
      isWin: false,
      raceAthleteId: parseInt(bet.raceAthleteId),
      userId: user.id,
    };

    try {
      const response = await fetch("https://localhost:7181/api/Bet", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(betData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert("Bet placed successfully!");

      // Update useContext credits
      setUser((prevUser) => ({
        ...prevUser,
        credits: prevUser.credits - betData.amount,
      }));
      
      setBet((prevBet) => ({ ...prevBet, amount: "" }));
    } catch (error) {
      console.error("Error placing bet:", error);
      alert("Failed to place bet.");
    }


  };

  const olympicColors = ["blue", "yellow", "black", "green", "red"];

  return (
    <div className="betting-page">
      <h1 className="page-title">Betting Page</h1>
      <button
        className="bet-button"
        onClick={() => navigate("/profile", { state: { tab: "bet-history" } })}
      >
        My Bets
      </button>
      <div className="races-container">
        {races.map((race) => (
          <div className="race-card" key={race.raceId}>
            <div className="race-header" onClick={() => fetchOdds(race.raceId)}>
              <span>Race ID: {race.raceId}</span>
              <span>Date: {new Date(race.date).toLocaleString()}</span>
            </div>
            {selectedRaceId === race.raceId && (
              <div className="bet-card">
                <div className="odds-header">
                  <h2>Odds for Race {race.raceId}</h2>
                </div>
                <ul>
                  {odds.map((o: any, index: number) => (
                    <li key={o.raceAthleteId} className="athlete-item">
                      <span className="athlete-name">{o.athleteName}</span>
                      <span className="ring-container">
                        <div
                          className={`ring ${
                            bet.raceAthleteId === o.raceAthleteId.toString()
                              ? `selected ${olympicColors[index % olympicColors.length]}`
                              : olympicColors[index % olympicColors.length]
                          }`}
                          onClick={() =>
                            setBet((prevBet) => ({
                              ...prevBet,
                              raceAthleteId: o.raceAthleteId.toString(),
                            }))
                          }
                        ></div>
                      </span>
                      <span className="odds-value">Odds: {o.odds}</span>
                    </li>
                  ))}
                </ul>
                <form>
                  <label>
                    Amount:
                    <input
                      type="number"
                      name="amount"
                      value={bet.amount}
                      onChange={(e) =>
                        setBet((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                    />
                  </label>
                  <button type="button" onClick={placeBet}>
                    Place Bet
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BettingPage;
