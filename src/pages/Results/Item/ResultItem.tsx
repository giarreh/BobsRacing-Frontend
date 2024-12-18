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
  const sortedAthletes = race.raceAthletes.sort((a, b) => a.finalPosition - b.finalPosition);

  const podium = sortedAthletes.slice(0, 3);
  const others = sortedAthletes.slice(3);

  return (
    <div className={`result-item ${isOpen ? "open" : ""}`}>
      <div className="result-header" onClick={() => setIsOpen(!isOpen)}>
        <p>Result ID: {race.raceId}</p>
        <p>Date: {new Date(race.date).toLocaleString()}</p>
      </div>
      {isOpen && (
        <div className="result-details">
          <h3>Participants and Results</h3>
          <div className="podium-container">
            {podium.map((raceAthlete, index) => (
              <div key={raceAthlete.raceAthleteId} className={`podium-position position-${index + 1}`}>
                <p className="athlete-name">{getAthleteName(raceAthlete.athleteId)}</p>
                <p className="athlete-place">Place: {raceAthlete.finalPosition}</p>
                <p className="athlete-time">Time: {raceAthlete.finishTime.toFixed(2)}s</p>
              </div>
            ))}
          </div>
          {others.length > 0 && (
            <ul className="results-list">
              {others.map((raceAthlete) => (
                <li key={raceAthlete.raceAthleteId}>
                  Place: {raceAthlete.finalPosition}: {getAthleteName(raceAthlete.athleteId)}, Time:{" "}
                  {raceAthlete.finishTime.toFixed(2)}s
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}