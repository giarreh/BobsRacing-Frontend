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

        // only show unfisinshed races to bet on
        const unfinishedRaces = data.filter((race: Race) => !race.isFinished);
        const sortedRaces = unfinishedRaces.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
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

  // Handle form inputs for the bet
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setBet((prevBet) => ({ ...prevBet, [name]: value }));
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

      const data = await response.json();
      alert("Bet placed successfully!");

      // update useContext credits
      setUser((prevUser) => ({
        ...prevUser,
        credits: prevUser.credits - betData.amount,
      }));
    } catch (error) {
      console.error("Error placing bet:", error);
      alert("Failed to place bet.");
    }
  };

  return (
    <div className="betting-page">
      <h1 className="page-title">Betting Page</h1>
      <button 
        className="bet-button" 
        onClick={() => navigate("/profile", { state: { tab: "bet-history" } })}>
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
                <h2>Odds for Race {race.raceId}</h2>
                <ul>
                  {odds.map((o: any) => (
                    <li key={o.raceAthleteId}>
                      {o.athleteName} - Odds: {o.odds}
                    </li>
                  ))}
                </ul>
                <form>
                  <label>
                    Athlete:
                    <select name="raceAthleteId" onChange={handleInputChange}>
                      <option value="">Select Athlete</option>
                      {odds.map((o: any) => (
                        <option key={o.raceAthleteId} value={o.raceAthleteId}>
                          {o.athleteName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Amount:
                    <input
                      type="number"
                      name="amount"
                      value={bet.amount}
                      onChange={handleInputChange}
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
