import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { UserContext } from '../../contexts/UserContext';

export default function Races() {
  const navigate = useNavigate();
  const { getAuthToken } = useContext(UserContext);
  const [races, setRaces] = useState([]);

  useEffect(() => {
    const fetchRaces = async () => {
      console.log('Fetching Races');
      try {
        const response = await fetch('https://localhost:7181/api/Race', {
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
        setRaces(data);
      } catch (error) {
        console.error('Error fetching races:', error);
      }
    };

    fetchRaces();
  }, []);
  
  return (
    <div>
      <h1 onClick={() => navigate("/createrace")}>Create a race!</h1>
      <h1 onClick={() => console.log("Races: ", races)}>Log races</h1>
    </div>
  )
}
