export interface Results {
  date: string;
  raceId: number;
  isFinished: boolean;
  positions: {
    athleteID: number;
    raceAthleteID: number;
    name: string;
    finalPosition: number;
    finishTime: number;
  }[];
}
