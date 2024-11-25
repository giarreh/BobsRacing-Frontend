// Horse.tsx
import React from 'react';

interface HorseProps {
  progress: number;
}

const Horse: React.FC<HorseProps> = ({ progress }) => {
  const style = {
    left: `${progress}%`, // Progress determines horse's position
    transition: 'left 0.1s linear',
  };

  return (
    <div className="horse" style={style}>
      🐎
    </div>
  );
};

export default Horse;
