// App.tsx
import React, { useState, useEffect } from 'react';
import RaceTrack from "./Racetrack"
import './App.css';


interface Horse {
  id: number;
  progress: number;
  speed: number;
  checkpointReached: boolean[];
}

const NUM_HORSES = 5; // 5 lanes, 5 horses
const CHECKPOINTS = [0, 0.33, 0.66]; // Progress positions for checkpoints
const FINISH_LINE = 95; // Finish line at 100% progress
const INITIAL_SPEED = 0.5; // Starting speed for each horse

const App: React.FC = () => {
  const [horses, setHorses] = useState<Horse[]>(
    Array(NUM_HORSES).fill(0).map((_, index) => ({
      id: index,
      progress: 0,
      speed: INITIAL_SPEED,
      checkpointReached: [false, false, false], // Keeps track of checkpoints reached
    }))
  );

  // Start the race when the component mounts
  useEffect(() => {
    const interval = setInterval(() => {
      updateHorsePositions();
    }, 100); // Update every 100ms

    return () => clearInterval(interval); // Clean up on component unmount
  }, [horses]);

  // Update horse positions based on their current speed
  const updateHorsePositions = () => {
    setHorses((prevHorses) =>
      prevHorses.map((horse) => {
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
      })
    );
  };

  return (
    <div className="App">
      <h1>Horse Race</h1>
      <RaceTrack horses={horses} />
    </div>
  );
};

export default App;
