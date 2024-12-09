import { useNavigate, } from 'react-router'
import { Athlete } from '../../interfaces/IAthlete';




export default function AtheleteItem({ athlete, index }: { athlete: Athlete, index: number }) {

  const navigate = useNavigate();
  const handleNavigate = () => {
    console.log(athlete);
    navigate(`/athlete/${athlete.athleteId}`);
  }

  return (
    <div className='animal-item' key={index} onClick={handleNavigate}>
      <h2>{athlete.name}</h2>
      <p>Slowest time: {athlete.fastestTime}</p>
      <p>Fastest time: {athlete.lowestTime}</p>
    </div>
  )
}
