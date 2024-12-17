import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import RaceItem from "./Item/RaceItem";
import { Athlete } from "../../interfaces/IAthlete";

export default function Races() {
  const navigate = useNavigate();
  const { getAuthToken } = useContext(UserContext);
  const [races, setRaces] = useState([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  const fetchAthletes = async () => {
    console.log("Fetching athletes");
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
      console.log(data);
      setAthletes(data);
    } catch (error) {
      console.error("Error fetching athletes:", error);
    }
  };
  const fetchRaces = async () => {
    console.log("Fetching Races");
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

      const sortedRaces = data.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
      );
      console.log(data);
      setRaces(sortedRaces);
    } catch (error) {
      console.error("Error fetching races:", error);
    }
  };

  useEffect(() => {
    fetchRaces();
    fetchAthletes();
  }, []);

  const unfinishedRaces = races.filter((race) => !race.isFinished);

  return (
    <div>
      <h1 onClick={() => navigate("/createrace")}>Create a race!</h1>
      <h1 onClick={() => console.log("Races: ", races)}>Log races</h1>
      {/* List only unfinished races */}
      <div>
        {unfinishedRaces.length > 0 ? (
          unfinishedRaces.map((race, index) => (
            <RaceItem
              key={index}
              race={race}
              index={index}
              athletes={athletes}
            />
          ))
        ) : (
          <p>No upcoming races available.</p>
        )}
      </div>
    </div>
  );
}
