import {useState, useEffect} from 'react'
import AnimalItem from './AnimalItem';
import './Animals.css'
import CreateAnimal from './CreateAnimal';


export default function Animals() {
  const [animals, setAnimals] = useState<{ animalId: number; name: string; minSpeed: number; maxSpeed: number; image: string; }[]>([
  ]);

  useEffect(() => {
    console.log('Fetching animals')
    fetch('https://localhost:7181/api/Animal')
    //fetch('animalracing.azurewebsites.net/api/animal')
    .then(response => {console.log(response); return response})
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setAnimals(data);
    })
  }, [])


  return (
    <div className="animal-page-container">
      {/* Create Animal Section */}
      <div className="create-animal-section">
        <CreateAnimal animals={animals} setAnimals={setAnimals} />
      </div>
      {/* Animal List Section */}
      <div className="animal-list-section">
        <h1>Animal List</h1>
        <div className="animal-list">
          {animals.map((animal, index) => (
            <AnimalItem key={index} animal={animal} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
