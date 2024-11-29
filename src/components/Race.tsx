import { useState, useEffect } from 'react';
import RaceTrack from '../Racetrack';

export default function Race() {
  interface Horse {
    id: number;
    progress: number;
    speed: number;
    checkpointReached: boolean[];
  }

const NUM_HORSES = 5; // 5 lanes, 5 horses
const CHECKPOINTS = [0, 0.33, 0.66]; // Progress positions for checkpoints
const FINISH_LINE = 100; // Finish line at 100% progress
const INITIAL_SPEED = 0.5; // Starting speed for each horse

const [started, setStarted] = useState(false);
const [horses, setHorses] = useState<Horse[]>(
  Array(NUM_HORSES).fill(0).map((_, index) => ({
    id: index,
    progress: 0,
    speed: INITIAL_SPEED,
    checkpointReached: [false, false, false], // Keeps track of checkpoints reached
  }))
);
const [finishOrder, setFinishOrder] = useState<number[]>([]); // Tracks the finish order

// Start the race when the component mounts
useEffect(() => {
  if (!started) return;

  const interval = setInterval(() => {
    updateHorsePositions();
  }, 100); // Update every 100ms

  return () => clearInterval(interval); // Clean up on component unmount
}, [started]);

// Update horse positions based on their current speed
const updateHorsePositions = () => {
  if (!started) return;
  setHorses((prevHorses) => {
    const updatedHorses = prevHorses.map((horse) => {
      // Skip if the horse has already finished
      if (finishOrder.includes(horse.id)) return horse;

      // Update position based on current speed
      let newProgress = horse.progress + horse.speed;

      // Check if the horse crosses a checkpoint
      CHECKPOINTS.forEach((checkpoint, index) => {
        if (!horse.checkpointReached[index] && newProgress >= checkpoint * FINISH_LINE) {
          // Randomize speed at checkpoint
          const newSpeed = Math.random() * 2 + 1; // Random speed between 1 and 3
          horse.speed = newSpeed;
          horse.checkpointReached[index] = true;
        }
      });

      // Stop the horse at the finish line
      if (newProgress >= FINISH_LINE) {
        newProgress = FINISH_LINE;
      }

      return { ...horse, progress: newProgress };
    });

    return updatedHorses;
  });
};

// Effect to track when horses finish and update the finish order
useEffect(() => {
  horses.forEach((horse) => {
    if (horse.progress === FINISH_LINE && !finishOrder.includes(horse.id)) {
      setFinishOrder((prevOrder) => [...prevOrder, horse.id]);
    }
  });
}, [horses, finishOrder]);

// Reset the race state
const resetRace = () => {
  setStarted(false);
  setFinishOrder([]);
  setHorses(
    Array(NUM_HORSES).fill(0).map((_, index) => ({
      id: index,
      progress: 0,
      speed: INITIAL_SPEED,
      checkpointReached: [false, false, false],
    }))
  );
};

// Display the final standings
const displayResults = () => {
  if (finishOrder.length > 0) {
    return (
      <div className="results">
        <h2>Race Results:</h2>
        <ol>
          {finishOrder.map((horseId, index) => (
            <li key={index}>Lane {horseId + 1}</li>
          ))}
        </ol>
      </div>
    );
  }
  return null;
};
  return (
    <div className='race'>
      <RaceTrack horses={horses} />
      <div className="controls">
        {!started && (
          <button onClick={() => setStarted(true)}>
            Start Race
          </button>
        )}
        {started && (
          <button onClick={resetRace}>
            Reset Race
          </button>
        )}
      </div>
      {displayResults()}
    </div>
  );
}
