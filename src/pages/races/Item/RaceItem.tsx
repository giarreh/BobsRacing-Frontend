import { Race } from '../../../interfaces/IRace'
import './RaceItem.css'
import { useNavigate } from 'react-router'


export default function RaceItem({
  race, index 
}: {race: Race, index: number}) {
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    console.log("Navigating to race: ", race);
    navigate(`/races/${race.raceId}`);
  };

  return (
    <div className='race-item' key={index} onClick={handleNavigate}>
      <p>Race ID: {race.raceId} </p>
      <p>Date of race: {race.date.toLocaleString()}</p>
      <h1>Participants</h1>
      <div className='race-participants'>
      </div>
    </div>
  );
}

