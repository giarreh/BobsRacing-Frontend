import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import RaceItem from "./Item/RaceItem";
import { AppContext } from "../../contexts/AppContext";
import { Race } from "../../interfaces/IRace";

export default function Races() {
  const navigate = useNavigate();
  const { races, athletes } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [unfinishedRaces, setUnfinishedRaces] = useState<Race[]>([]);

  useEffect(() => {
    // Check if races and athletes are loaded
    if (races && athletes) {
      // Safely filter unfinished races
      const filteredRaces = races.filter((race) => !race.isFinished);
      setUnfinishedRaces(filteredRaces);
      setIsLoading(false);
    }
  }, [races, athletes]);

  if (isLoading) {
    return <p>Loading...</p>; // You can show a loading spinner or message
  }

  return (
    <div>
      <h1 onClick={() => navigate("/createrace")}>Create a race!</h1>
      {/* List only unfinished races */}
      <div>
        {unfinishedRaces.length > 0 ? (
          unfinishedRaces.map((race: Race, index) => (
            <RaceItem
              key={race.raceId} // Use a unique ID for keys
              race={race}
              index={index}
              athletes={athletes}
            />
          ))
        ) : (
          <p>No upcoming races available.</p>
        )}
      </div>
    </div>
  );
}
