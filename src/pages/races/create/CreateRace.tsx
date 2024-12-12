import { useContext, useState, useEffect } from 'react';
import { Race } from '../../../interfaces/IRace';
import { Athlete } from '../../../interfaces/IAthlete';
import { UserContext } from '../../../contexts/UserContext';
import AtheleteItemRace from '../utils/AthleteItemRace';
import { RaceAthlete } from '../../../interfaces/IRaceAthlete';

export default function CreateRace() {
  const { getAuthToken } = useContext(UserContext);

  const [raceCreated, setRaceCreated] = useState(false);

  // Athletes that have been fetched
  const [fetchedAthletes, setFetchedAthletes] = useState<Athlete[]>([]);

  // Athletes that have been selected to be in the race
  const [selectedAthletes, setSelectedAthletes] = useState<Athlete[]>([]);

  const [raceAthletes, setRaceAthletes] = useState<RaceAthlete[]>([]);

    // Control visibility of athlete list
    const [isAthleteListVisible, setIsAthleteListVisible] = useState(true);

  const [race, setRace] = useState<Race>({
    raceId: 0,
    date: new Date().toISOString(),
  });


  // Step 1: Create race for database
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

  // Step 2: Fetch athletes when race is created
  useEffect(() => {
    if (raceCreated) {
      const fetchAthletes = async () => {
        console.log('Fetching athletes in create race');
        try {
          const response = await fetch('https://localhost:7181/api/Athlete', {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log(data);
          setFetchedAthletes(data);
        } catch (error) {
          console.error('Error fetching athletes:', error);
        }
      };

      fetchAthletes();
    }
  }, [raceCreated]);

  // Step 3: Create raceAthlete for each selected athlete, assign them to the race
  const handleCreateRaceAthletes = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      for (const athlete of selectedAthletes) {
      console.log("Creating raceAthlete athlete for:", athlete);
      fetch("https://localhost:7181/api/RaceAthlete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          raceAthleteid: 0,
          raceId: race.raceId,
          athleteId: athlete.athleteId,
          finalPosition: 0,
        }),
      }).then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          // Use the server response (data) to update the list
          setRaceAthletes([...raceAthletes, data]);
          console.log("athlete debug: ", data);
        });
      }
      console.log("RACE ATHLETED SUBMITTED: ", raceAthletes);
    } catch (error) {
      console.error('Error:', error);
      
    }


  };



  return (
    <div className="race-list">
      <h1>Create</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">Date</label>
        <input type="datetime-local" onChange={handleDateTime} id="date" />
        {!raceCreated && <button type="submit">Create</button>}
      </form>
      <button onClick={() => console.log(race)}>Log</button>

      {/* Conditionally render this div if raceId is not empty */}
      {raceCreated && (
        <div className="success-message">
          <h2>Race Created Successfully!</h2>
          <p>Race ID: {race.raceId}</p>
          <p>Race Date: {new Date(race.date).toLocaleString()}</p>
          <button onClick={() => console.log(selectedAthletes)}>Log selected athletes</button>
          <button onClick={() => setIsAthleteListVisible(!isAthleteListVisible)}>
            {isAthleteListVisible ? 'Hide' : 'Show'} Athletes
          </button>
          {selectedAthletes.length === 5 && (
            <button onClick={handleCreateRaceAthletes}>Create athletes</button>)}
          {/* List of Athletes */}
          {isAthleteListVisible && (
            <div className="athlete-list-section">
              <h1>Select up to 5 athletes to add</h1>
              <div className="athlete-list">
                {fetchedAthletes.map((athlete, index) => (
                  <AtheleteItemRace
                    key={index}
                    athlete={athlete}
                    index={index}
                    selectedAthletes={selectedAthletes}
                    setSelectedAthletes={setSelectedAthletes}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
