import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import ResultItem from "./Item/ResultItem";
import { Athlete } from "../../interfaces/IAthlete";
import { Race } from "../../interfaces/IRace";
import "./Results.css";

export default function Results() {
  const navigate = useNavigate();
  const { getAuthToken } = useContext(UserContext);
  const [races, setRaces] = useState<Race[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await fetch("https://localhost:7181/api/Athlete", {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAthletes(data);
      } catch (error) {
        console.error("Error fetching athletes:", error);
      }
    };

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

        // Sort races by date
        const sortedRaces = data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRaces(sortedRaces);
      } catch (error) {
        console.error("Error fetching races:", error);
      }
    };

    fetchAthletes();
    fetchRaces();
  }, [getAuthToken]);

  const filteredRaces = races.filter((race) =>
    race.raceId.toString().includes(searchQuery)
  );
  const finishedRaces = filteredRaces.filter((race) => race.isFinished);

  return (
    <div className="results-page">
  <h1 className="page-title">Results</h1>
  <div className="search-container">
    <input
      type="text"
      placeholder="Search by result ID"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
  <div className="results-container">
    {finishedRaces.length > 0 ? (
      finishedRaces.map((race, index) => (
        <ResultItem
          key={index}
          race={race}
          index={index}
          athletes={athletes}
        />
      ))
    ) : (
      <p>No finished results available.</p>
    )}
  </div>
</div>

  );
}
