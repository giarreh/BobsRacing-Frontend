import { RaceAthlete } from "./IRaceAthlete";

export interface Race {
  raceId: number;
  date: Date | string;
  raceAthletes: RaceAthlete[];
}