import { useContext, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { UserContext } from '../../../contexts/UserContext';
import { Race } from '../../../interfaces/IRace';
import { Runner } from '../utils/IRunner';
import { Results } from '../utils/IResults';
import axios from 'axios';
import { useSignalR } from '../../../contexts/SignalR/SignalRContext';
import { AppContext } from '../../../contexts/AppContext';

export default function RaceDetails() {
  const { id } = useParams();
  const { getAuthToken } = useContext(UserContext);
  const { races, setRaces } = useContext(AppContext);
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
  const [timeUntil, setTimeUntil] = useState<string>('Calculating...');
  const signalRService = useSignalR();

  // Fetch race data by ID
  const fetchRace = async () => {
    console.log('Fetching race with ID: ', id);
    try {
      await fetch(`https://localhost:7181/api/Race/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          console.log('Successfully fetched race: ', data);
          // sort by data.raceAthletes.position
          setRace(data);
          // Fetch results only if the race is finished
          if (data.isFinished) {
            const resultsResponse = await fetch(
              `https://localhost:7181/api/RaceSimulation/results/${id}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${getAuthToken()}`,
                },
              }
            );
            const resultsData = await resultsResponse.json();
            setResults(resultsData);
            setShowResult(true);
            // remove from raceList
          }
        });
    } catch (error) {
      console.error('Error fetching race', error);
    } finally {
      setLoading(false); // Mark loading as complete
    }
  };

  // Fetch race data by ID on mount
  useEffect(() => {
    fetchRace();
  }, [id]);

  // Connect to the race simulation SignalR hub
  useEffect(() => {
    const connection = signalRService.getConnection();
    if (!connection) {
      console.error('SignalR connection is not initialized.');
      return;
    }
    console.log('SignalR connection', connection);

    // Listen for race updates broadcast
    connection.on('ReceiveRaceUpdate', (updatedRunners: Runner[]) => {
      console.log('Updated runners:', updatedRunners);
      setRunners(updatedRunners);
      if (!raceStarted) {
        setRaceStarted(true);
      }
    });

    // Listen for race results broadcast
    connection.on('ReceiveRaceResults', (data) => {
      console.log('Race results received:', data);
      setResults(data);
      setShowResult(true);
      setRaces(races.filter((r) => r.raceId !== Number(id)));
    });

    return () => {
      connection.stop().catch((err) => console.error('Error stopping connection', err));
    };
  }, [signalRService]);

  const startRace = useCallback(async () => {
    try {
      setRaceStarted(true);
      await axios
        .post(
          `https://localhost:7181/api/RaceSimulation/start?raceId=${id}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        )
        .then((response) => response.data)
        .then((data) => {
          setResults(data);
          setShowResult(true);
        });
      //delete race from races           setAthletes([...athletes, data]);
    } catch (err) {
      console.error('Error starting race: ', err);
    }
  }, [id, getAuthToken]);

  useEffect(() => {
    const calculateTimeUntil = (targetDate: string) => {
      const target = new Date(targetDate);
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setRaceStarted(true);
        return 'Starting very shortly!';
      }

      const days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
      const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const minutes = String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, '0');
      const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, '0');
      return `${days}:${hours}:${minutes}:${seconds}`;
    };

    const intervalId = setInterval(() => {
      setTimeUntil(calculateTimeUntil(race.date.toString()));
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval when component unmounts
  }, [race.date]);

  return (
    <div>
      <div className='race-header'>
        <span>Race ID: {race.raceId}</span>
        <span>Starting in: {!race.isFinished && timeUntil}</span>
        <span>Date: {new Date(race.date).toLocaleString()}</span>
      </div>
      <div className="track">
        {runners.length > 0 ? (
          runners.map((runner, index) => (
            <div
              key={`${runner.name}-${index}`}
              className="runner"
              style={{
                left: 0, // Start at the left edge of the track
                transform: `translateX(${(runner.position / 100) * 100}%)`, // Convert position to percentage on screen
                top: `${index * 60}px`, // Space runners vertically
              }}
            >
            🏃{runner.name} - {runner.position.toFixed()}m 
            </div>
          ))
        ) : (
          // Placeholder runners
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="runner placeholder"
              style={{
                left: 0, // Start at the left edge
                transform: 'translateX(0%)', // Placeholders start at 0
                top: `${index * 60}px`, // Space placeholders vertically
              }}
            >
              🏃
            </div>
          ))
        )}
      </div>
      {results && showResult && (
        <div>
          <h2>Race Results</h2>
          <p>WINNER: {results?.positions?.[0]?.name || results?.positions?.[1]?.name}</p>
          <table>
            <thead>
              <tr>
                <th>Final Position</th>
                <th>Athlete</th>
                <th>Finish time</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(results.positions).map((athlete) => (
                <tr key={athlete.raceAthleteID}>
                  <td>{athlete.finalPosition}</td>
                  <td>{athlete.name}</td>
                  <td>{athlete.finishTime.toPrecision(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
