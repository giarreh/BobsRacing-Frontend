import {useState, useEffect} from 'react'
import './Athletes.css'
import { Athlete } from '../../interfaces/IAthlete';
import CreateAthlete from './CreateAthlete';
import AtheleteItem from './AthleteItem';


export default function Athletes() {
  const [athletes, setAthletes] = useState<Athlete[]>([
  ]);

  useEffect(() => {
    console.log('Fetching athletes')
    fetch('https://localhost:7181/api/Athlete')
    .then(response => {console.log(response); return response})
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setAthletes(data);
    })
  }, [])


  return (
    <div className="animal-page-container">
      {/* Create Athlete Section */}
      <div className="create-animal-section">
        <CreateAthlete athletes={athletes} setAthletes={setAthletes} />
      </div>
      {/* Athlete List Section */}
      <div className="animal-list-section">
        <h1>Athlete List</h1>
        <div className="animal-list">
          {athletes.map((athlete, index) => (
            <AtheleteItem key={index} athlete={athlete} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
