import {useState, useEffect} from 'react'
import AnimalItem from '../components/AnimalItem';

export default function Animals() {

  const defaultAnimal = {
    name: '',
    minSpeed: 0,
    maxSpeed: 0
  };

  const [animals, setAnimals] = useState<{ name: string; minSpeed: number; maxSpeed: number; }[]>([])

  const [animal, setAnimal] = useState({
    name: '',
    minSpeed: 0,
    maxSpeed: 0
  })


  useEffect(() => {
    console.log('Fetching animals')
    //fetch('http://localhost:5238/api/Animal')
    fetch('animalracing.azurewebsites.net/api/animal')
    .then(response => {console.log(response); return response})
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setAnimals(data)
    })
  }, [])

  const handleNameChange = (e: any) => {
    setAnimal({...animal, name: e.target.value})
  }

  const handleMinSpeedChange = (e: any) => {
    setAnimal({...animal, minSpeed: e.target.value})
  }

  const handleMaxSpeedChange = (e: any) => {
    setAnimal({...animal, maxSpeed: e.target.value})
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log(animal)

    if(animal.name === '' || animal.minSpeed === 0 || animal.maxSpeed === 0) {
      return alert('Submit failed, please fill out all fields');
    }

    try {
      console.log('Submitting animal:', animal);
      fetch('http://localhost:5238/api/Animal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animal),
    })
    
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setAnimals([...animals, animal])
      setAnimal(defaultAnimal);
    })      
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating animal');
    }
  }
  return (
    <div>
      <h1>Create an animal!</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Name' value={animal.name} onChange={handleNameChange} />
        <input type='number' placeholder='Min Speed' value={animal.minSpeed} onChange={handleMinSpeedChange} />
        <input type='number' placeholder='Max Speed' value={animal.maxSpeed} onChange={handleMaxSpeedChange} />
        <button type='submit'>Submit</button>
      </form>
      <div>
        {animals.map((animal, index) => {
          return (
            <AnimalItem key={index} animal={animal} index={index} />
          )
        })}
      </div>
    </div>

  )
}
