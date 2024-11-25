// RaceTrack.tsx
import React from 'react';
import Lane from './Lane';

interface Horse {
  id: number;
  progress: number;
  speed: number;
  checkpointReached: boolean[];
}

interface RaceTrackProps {
  horses: Horse[];
}

const RaceTrack: React.FC<RaceTrackProps> = ({ horses }) => {
  return (
    <div className="race-track">
      {horses.map((horse) => (
        <Lane key={horse.id} horse={horse} />
      ))}
    </div>
  );
};

export default RaceTrack;
