import { Athlete } from "../../../interfaces/IAthlete";
import { Race } from "../../../interfaces/IRace";
import { useState } from "react";
import "./ResultItem.css";

export default function ResultItem({
  race,
  index,
  athletes,
}: {
  race: Race;
  index: number;
  athletes: Athlete[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const getAthleteName = (athleteId: number) => {
    const athlete = athletes.find((athlete) => athlete.athleteId === athleteId);
    return athlete ? athlete.name : "Unknown Athlete";
  };

  return (
    <div className={`result-item ${isOpen ? "open" : ""}`}>
      <div className="result-header" onClick={() => setIsOpen(!isOpen)}>
        <p>Result ID: {race.raceId}</p>
        <p>Date: {new Date(race.date).toLocaleString()}</p>
      </div>
      {isOpen && (
        <div className="result-details">
          <h3>Participants</h3>
          <ul className="participants-list">
            {race.raceAthletes.map((raceAthlete) => (
              <li key={raceAthlete.athleteId}>
                {getAthleteName(raceAthlete.athleteId)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
