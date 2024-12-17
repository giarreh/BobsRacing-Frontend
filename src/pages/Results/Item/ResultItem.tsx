import { Athlete } from '../../../interfaces/IAthlete';
import { Race } from '../../../interfaces/IRace'
import { useNavigate } from 'react-router'


export default function ResultItem({
  race, index, athletes 
}: {race: Race, index: number, athletes: Athlete[]}) {
  const navigate = useNavigate();
  

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
      <p>Date of race: {race.date?.toLocaleString()}</p>
      <h1>Participants</h1>
      <div className="race-participants">
        {race.raceAthletes.map((raceAthlete) => (
          <p key={raceAthlete.athleteId}>
            {getAthleteName(raceAthlete.athleteId)}
          </p>
        ))}
      </div>
    </div>
  );
}

