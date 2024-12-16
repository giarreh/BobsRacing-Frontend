import { useContext, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { UserContext } from '../../../contexts/UserContext';
import { Race } from '../../../interfaces/IRace';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Runner } from '../utils/IRunner';
import { Results } from '../utils/IResults';
import axios from 'axios';

export default function RaceDetails() {
  const { id } = useParams();
  const { getAuthToken } = useContext(UserContext);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [runners, setRunners] = useState<Runner[]>([]);
  const [results, setResults] = useState<Results | null>(null); // Initialize results as null
  const [raceStarted, setRaceStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const [race, setRace] = useState<Race>({
    raceId: 0,
    date: new Date(),
    raceAthletes: [],
    isFinished: false,
  });

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
        .then(async (data) => {
          console.log("Successfully fetched race: ", data);
          // sort by data.raceAthletes.position
          data.raceAthletes.sort(
            (a: RaceAthlete, b: RaceAthlete) =>
              a.finalPosition - b.finalPosition
          );
          setRace(data);
          // Fetch results only if the race is finished
          if (data.isFinished) {
            const resultsResponse = await fetch(
              `https://localhost:7181/api/RaceSimulation/results/${id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${getAuthToken()}`,
                },
              }
            );
            const resultsData = await resultsResponse.json();
            setResults(resultsData);
            setShowResult(true);
          }
        });
    } catch (error) {
      console.error("Error fetching race", error);
    } finally {
      setLoading(false); // Mark loading as complete
    }
  };

  // Fetch race data by ID on mount
  useEffect(() => {
    fetchRace();
  }, [id]);

  // Check if the race has finished (already has results)
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
      if (!raceStarted) {
        setRaceStarted(true);
      }
    });

    // Listen for race results broadcast
    newConnection.on("ReceiveRaceResults", (data) => {
      console.log("Race results received:", data);
      setResults(data);
    });

    setConnection(newConnection);

    return () => {
      newConnection
        .stop()
        .catch((err) => console.error("Error stopping connection", err));
    };
  }, [raceStarted]);

  const startRace = useCallback(async () => {
    try {
      setRaceStarted(true);
      await axios
        .post(
          `https://localhost:7181/api/RaceSimulation/start?raceId=${id}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        )
        .then((response) => response.data)
        .then((data) => {
          setResults(data);
          setShowResult(true);
        });
    } catch (err) {
      console.error("Error starting race: ", err);
    }
  }, [id, getAuthToken]);

  return (
    <div>
      <h1 onClick={() => console.log(results)}>Race with ID: {id}</h1>
    {!loading && !race.isFinished && (
      <button onClick={startRace} disabled={raceStarted}>          {raceStarted ? "Race in Progress" : "Start Race!!"}        </button> 
      )}
      <div className="track">
        {runners.map((runner, index) => (
          <div key={`${runner.name}-${index}`} className="runner">
            🏃 {runner.name} POSITION: {runner.position} SPEED: {runner.speed}
          </div>
        ))}
      </div>
      {results && showResult && (
        <div>
          <h2>Race Results</h2>
          <p>WINNER: {results?.positions[0]?.name}</p>
          <table>
            <thead>
              <tr>
                <th>Final Position</th>
                <th>Athlete</th>
                <th>Race Athlete ID</th>
                <th>Finish time</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(results.positions).map((athlete) => (
                <tr key={athlete.raceAthleteID}>
                  <td>{athlete.finalPosition}</td>
                  <td>{athlete.name}</td>
                  <td>{athlete.raceAthleteID}</td>
                  <td>{athlete.finishTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
