import {useState, useEffect, useContext} from 'react'
import './Athletes.css'
import { Athlete } from '../../interfaces/IAthlete';
import CreateAthlete from './CreateAthlete';
import AtheleteItem from './AthleteItem';
import { UserContext } from '../../contexts/UserContext';


export default function Athletes() {
  const [athletes, setAthletes] = useState<Athlete[]>([
  ]);
  const { user, getAuthToken } = useContext(UserContext); 



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

  useEffect(() => {
    fetchAthletes();
  }, []);

  return (
    <div className="athlete-page-container">
      {/* Create Athlete Section (Admin Only) */}
      {user?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === "Admin" && (
        <div className="create-athlete-section">
          <h1>Create Athlete</h1>
          <CreateAthlete athletes={athletes} setAthletes={setAthletes} />
        </div>
      )}

      {/* Athlete List Section (Visible to All) */}
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
