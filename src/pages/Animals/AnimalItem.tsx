import { useNavigate } from 'react-router'
import { Animal } from '../../interfaces/IAnimal';
export default function AnimalItem({ animal, index }: { animal: Animal, index: number }) {

  const navigate = useNavigate();
  const handleNavigate = () => {
    console.log(animal);
    navigate(`/animals/${index+1}`);
  }
  return (
    <div className='animal-item' key={index} onClick={handleNavigate}>
      <h2>{animal.name}</h2>
      <p>Min Speed: {animal.minSpeed}</p>
      <p>Max Speed: {animal.maxSpeed}</p>
    </div>
  )
}
