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
  const [searchQuery, setSearchQuery] = useState("");
 
  useEffect(() => {
    // Check if races and athletes are loaded
    if (races && athletes) {
      // Safely filter unfinished races
      const filteredRaces = races.filter((race) => !race.isFinished);
 
      // show earliest race at top
      const sortedRaces = filteredRaces.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
        );
 
      setUnfinishedRaces(sortedRaces);
      setIsLoading(false);
    }
  }, [races, athletes]);

  const filteredRaces = unfinishedRaces.filter((race) =>
    race.raceId.toString().includes(searchQuery) // Compare raceId with searchQuery
  );
  if (isLoading) {
    return <p>Loading...</p>; // You can show a loading spinner or message
  }
 
  return (
    <div>
      <h1 onClick={() => navigate("/createrace")}>Create a race!</h1>
      {/* List only unfinished races */}

      <div>
        <input
          type="text"
          placeholder="Search by race ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div>
        {filteredRaces.length > 0 ? (
          filteredRaces.map((race: Race, index) => (
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