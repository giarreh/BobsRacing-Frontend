import { useContext, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router'
import { UserContext } from '../../../contexts/UserContext';
import { Race } from '../../../interfaces/IRace';
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import { Runner } from '../utils/IRunner';
import { Results } from '../utils/IResults';
export default function RaceDetails() {
  const { id } = useParams();
  const { getAuthToken } = useContext(UserContext);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [race, setRace] = useState<Race>({
    raceId: 0,
    date: new Date(),
    raceAthletes: [],
  });
  const [runners, setRunners] = useState<Runner[]>([]);
  const [results, setResults] = useState<Results | null>(null); // Initialize results as null

  // Fetch race data by ID
  const fetchRace = async () => {
    console.log("Fetching race with ID: ", id);
    try {
      await fetch(`https://localhost:7181/api/Race/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Successfully fetched race: ", data);
          setRace(data);
        });
    } catch (error) {
      console.error("Error fetching race", error);
    }
  };

  // Fetch race data by ID on mount
  useEffect(() => {
    fetchRace();
  }, [id]);

  // Set up SignalR connection
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7181/raceSimulationHub")
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => console.log("Connected to SignalR Hub"))
      .catch((err) => console.error("SignalR Connection Error: ", err));

    newConnection.on("ReceiveRaceUpdate", (updatedRunners: Runner[]) => {
      console.log("Updated runners:", updatedRunners);
      setRunners(updatedRunners);
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop().catch((err) =>
        console.error("Error stopping connection", err)
      );
    };
  }, []);

  // Start race function:
  const startRace = useCallback(async () => {
    try {
      const response = await fetch(
        `https://localhost:7181/api/RaceSimulation/start?raceId=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      const data: Results = await response.json();
      console.log("Race results:", data);
      setResults(data);
    } catch (err) {
      console.error("Error starting race: ", err);
    }
  }, []);

  return (
    <div>
      <h1 onClick={() => console.log(results)} >Race with ID: {id}</h1>
      <button onClick={startRace}>Start race!!</button>
      <div className="track">
        {runners.map((runner, index) => (
          <div key={`${runner.name}-${index}`} className="runner">
            🏃 {runner.name} POSITION: {runner.position} SPEED: {runner.speed}
          </div>
        ))}
      </div>
      {results && (
        <div>
          <h2>Race Results</h2>
          <p>WINNER: {results?.positions["1"]?.name}</p>

          <table>
            <thead>
              <tr>
                <th>Final Position</th>
                <th>Athlete</th>
                <th>Race Athlete ID</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(results.positions).map((athlete) => (
                <tr key={athlete.raceAthleteID}>
                  <td>{athlete.finalPosition}</td>
                  <td>{athlete.name}</td>
                  <td>{athlete.raceAthleteID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
}

