import { useContext, useState } from 'react';
import { Race } from '../../../interfaces/IRace';
import { UserContext } from '../../../contexts/UserContext';

export default function CreateRace() {
  const { getAuthToken } = useContext(UserContext);
  
  const [raceCreated, setRaceCreated] = useState(false);
  const [race, setRace] = useState<Race>({
    raceId: 0,
    date: new Date().toISOString(),
  });

  // Step 1:
  const handleDateTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRace({ ...race, date: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting race: ', race);

    try {
      const response = await fetch('https://localhost:7181/api/Race', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(race),
      });

      const data = await response.json();
      console.log('Successfully created data: ', data);
      setRaceCreated(true);
      setRace(data);
      alert('Successfully created a race, continue to the next step');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Step 2:

  return (
    <div className="race-list">
      <h1>Create</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">Date</label>
        <input type="datetime-local" onChange={handleDateTime} id="date" />
        <button type="submit">Create</button>
      </form>
      <button onClick={() => console.log(race)}>Log</button>

      {/* Conditionally render this div if raceId is not empty */}
      {raceCreated && (
        <div className="success-message">
          <h2>Race Created Successfully!</h2>
          <p>Race ID: {race.raceId}</p>
          <p>Race Date: {new Date(race.date).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
