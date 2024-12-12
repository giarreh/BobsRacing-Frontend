export interface Results {
  date: string;
  raceId: number;
  positions: {
    athleteID: number;
    raceAthleteID: number;
    name: string;
    finalPosition: number;
    finishTime: number;
  }[];
}
