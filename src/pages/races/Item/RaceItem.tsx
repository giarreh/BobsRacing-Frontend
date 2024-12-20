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
  const [timeUntil, setTimeUntil] = useState<string>('Calculating...');

  useEffect(() => {
    if (race && athletes.length > 0) {
      setLoading(false); // Assume data fetch is complete
    }
  }, [race, athletes]);

  const getAthleteName = (athleteId: number) => {
    const athlete = athletes.find((athlete) => athlete.athleteId === athleteId);
    return athlete ? athlete.name : 'Unknown Athlete';
  };

  const handleNavigate = () => {
    console.log("Navigating to race: ", race);
    navigate(`/races/${race.raceId}`);
  };

  // time left until race starts
  useEffect(() => {
    const calculateTimeUntil = (targetDate: string) => {
      const target = new Date(targetDate);
      const now = new Date();
      const difference = target.getTime() - now.getTime();
  
      if (difference <= 0) {
          return "The race has started!";
      }
  
      const days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
      const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const minutes = String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, '0');
      const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, '0');
      return `${days}:${hours}:${minutes}:${seconds}`;
  };
  

    const intervalId = setInterval(() => {
      setTimeUntil(calculateTimeUntil(race.date.toString()));
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval when component unmounts
  }, [race.date]);


  return (
    <div className="race-card" key={index} onClick={handleNavigate}>
      <div className='race-header'>
        <span>Race ID: {race.raceId} </span>
        <span>Date: {new Date(race.date).toLocaleString()}</span>
        {!race.isFinished && <p>Starting in: {timeUntil}</p>}
      </div>
      
      <h1>Participants</h1>
      <div className="race-participants">
        {(!loading) ? (
          race?.raceAthletes?.map((raceAthlete) => (
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
