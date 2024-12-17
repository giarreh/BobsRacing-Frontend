import { useState, createContext, ReactNode, useEffect, useContext } from "react";
import { Race } from "../interfaces/IRace";
import { UserContext } from "./UserContext";
import { Athlete } from "../interfaces/IAthlete";
import { RaceAthlete } from "../interfaces/IRaceAthlete";

// Define an interface for the context value
interface AppContextValue {
  races: Race[];
  setRaces: (races: Race[]) => void;
  athletes: Athlete[];
  setAthletes: (athletes: Athlete[]) => void;
  raceAthletes: RaceAthlete[];
  setRaceAthletes: (raceAthletes: RaceAthlete[]) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext({} as AppContextValue);

export default function AppContextProvider({ children }: { children: ReactNode }) {
  const [races, setRaces] = useState<Race[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [raceAthletes, setRaceAthletes] = useState<RaceAthlete[]>([]);

  const { user, getAuthToken } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!user){
        console.log("No user found, aborting data fetch");
      }

      try {
        const headers = {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        };

        const racesResponse = await fetch('https://localhost:7181/api/Race', { headers });
        const athletesResponse = await fetch('https://localhost:7181/api/Athlete', { headers });
        const raceAthletesResponse = await fetch('https://localhost:7181/api/RaceAthlete', { headers });

        if (racesResponse.ok && athletesResponse.ok && raceAthletesResponse.ok) {
          const racesData = await racesResponse.json();
          const athletesData = await athletesResponse.json();
          const raceAthletesData = await raceAthletesResponse.json();

          setRaces(racesData);
          setAthletes(athletesData);
          setRaceAthletes(raceAthletesData);

          console.log("RACES ARE SET: ", racesData);
          console.log("ATHLETES ARE SET: ", athletesData);
          console.log("RACEATHLETES ARE SET: ", raceAthletesData);
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    console.log("USER UPDATED, REFETCHING DATA...");
  }, [user, getAuthToken]);

  return (
    <AppContext.Provider value={{ races, setRaces, athletes, setAthletes, raceAthletes, setRaceAthletes }}>
      {children}
    </AppContext.Provider>
  );
}
