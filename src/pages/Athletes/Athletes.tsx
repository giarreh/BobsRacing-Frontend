import {useState, useEffect, useContext} from 'react'
import './Athletes.css'
import { Athlete } from '../../interfaces/IAthlete';
import CreateAthlete from './CreateAthlete';
import AtheleteItem from './AthleteItem';
import { UserContext } from '../../contexts/UserContext';


export default function Athletes() {
  const [athletes, setAthletes] = useState<Athlete[]>([
  ]);
  const { getAuthToken } = useContext(UserContext); 


  useEffect(() => {
    const fetchAthletes = async () => {
      console.log('Fetching athletes');
      try {
        const response = await fetch('https://localhost:7181/api/Athlete', {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setAthletes(data);
      } catch (error) {
        console.error('Error fetching athletes:', error);
      }
    };

    fetchAthletes();
  }, []);
/* 
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
 */

  return (
    <div className="athlete-page-container">
      {/* Create Athlete Section */}
      <div className="create-athlete-section">
        <h1>Create Athlete</h1>
        <CreateAthlete athletes={athletes} setAthletes={setAthletes} />
      </div>
      {/* Athlete List Section */}
      <div className="athlete-list-section">
        <h1>Athlete List</h1>
        <div className="athlete-list">
          {athletes.map((athlete, index) => (
            <AtheleteItem key={index} athlete={athlete} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
