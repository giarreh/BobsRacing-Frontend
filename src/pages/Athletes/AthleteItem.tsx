import { useNavigate, } from 'react-router'
import { Athlete } from '../../interfaces/IAthlete';




export default function AtheleteItem({ athlete, index }: { athlete: Athlete, index: number }) {

  const navigate = useNavigate();
  const handleNavigate = () => {
    console.log(athlete);
    navigate(`/athlete/${athlete.athleteId}`);
  }

  return (
    <div className='athlete-item' key={index} onClick={handleNavigate}>
      <h2>{athlete.name}</h2>
      <p>Fastest time: {athlete.fastestTime}</p>
      <p>Slowest time: {athlete.slowestTime}</p>
    </div>
  )
}
