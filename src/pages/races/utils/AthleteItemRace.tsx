import { Athlete } from '../../../interfaces/IAthlete'; 


// Called when selecting an athlete in the creation of a race.
export default function AtheleteItemRace(
  { athlete, index, setSelectedAthletes, selectedAthletes,  } : 
  { athlete: Athlete, index: number, setSelectedAthletes: (athletes: Athlete[]) => void, selectedAthletes: Athlete[]}) {

  const isSelected = selectedAthletes.some(a => a.athleteId === athlete.athleteId);

  const SelectAthlete = () => {
    if (isSelected) {
      // Remove athlete from selected list
      setSelectedAthletes(selectedAthletes.filter(a => a.athleteId !== athlete.athleteId));
    } else if (selectedAthletes.length < 5) {
      // Add athlete to selected list if the number of selected athletes is less than 5
      setSelectedAthletes([...selectedAthletes, athlete]);
    } else {
      alert('You can only select up to 5 athletes.');
    }
  };

  return (
    <div 
      className={`athlete-item ${isSelected ? 'selected' : ''}`} 
      key={index} 
      onClick={SelectAthlete}
      style={{
        backgroundColor: isSelected ? 'lightblue' : 'white', // Change to your preferred colors
        cursor: 'pointer',
      }}
    >
      <h2>{athlete.name}</h2>
      <p>Fastest time: {athlete.fastestTime}</p>
      <p>Slowest time: {athlete.slowestTime}</p>
    </div>
  );
}
