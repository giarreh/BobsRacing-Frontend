// Lane.tsx
import React from 'react';
import Horse from './Horse';

interface Horse {
  id: number;
  progress: number;
  speed: number;
  checkpointReached: boolean[];
}

interface LaneProps {
  horse: Horse;
}

const Lane: React.FC<LaneProps> = ({ horse }) => {
  return (
    <div className="lane">
      <div className="checkpoint cp1"></div>
      <div className="checkpoint cp2"></div>
      <div className="checkpoint cp3"></div>
      <Horse progress={horse.progress} />
    </div>
  );
};

export default Lane;
