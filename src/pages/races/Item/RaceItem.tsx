import { useState, useEffect } from 'react';
import { Athlete } from '../../../interfaces/IAthlete';
import { Race } from '../../../interfaces/IRace';
import './RaceItem.css';
import { useNavigate } from 'react-router';

export default function RaceItem({
  race, index, athletes
}: { race: Race, index: number, athletes: Athlete[] }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assume data is fetched asynchronously
    // This is where you would typically set your loading state to false once data is available
    if (race && athletes.length > 0) {
      setLoading(false); // Assume data fetch is complete
    }
  }, [race, athletes]);

  // Helper function to get athlete name
  const getAthleteName = (athleteId: number) => {
    const athlete = athletes.find((athlete) => athlete.athleteId === athleteId);
    return athlete ? athlete.name : 'Unknown Athlete';
  };

  const handleNavigate = () => {
    console.log("Navigating to race: ", race);
    navigate(`/races/${race.raceId}`);
  };

  return (
    <div className="race-item" key={index} onClick={handleNavigate}>
      <p>Race ID: {race.raceId}</p>
      <p>
        Date of race: {new Date(race.date)
          .toLocaleString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit', 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          })
          .replace(',', ' -')}
      </p>
      <h1>Participants</h1>
      <div className="race-participants">
        {race?.raceAthletes && race.raceAthletes.length > 0 ? (
          race.raceAthletes.map((raceAthlete) => (
            <p key={raceAthlete.athleteId}>
              {getAthleteName(raceAthlete.athleteId)}
            </p>
          ))
        ) : (
          <p>No participants available</p>
        )}
      </div>
    </div>
  );
}
