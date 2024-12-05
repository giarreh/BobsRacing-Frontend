import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import './Animals.css'

export default function CreateAnimal({ animals, setAnimals }: any) {


  const navigate = useNavigate();

  const defaultAnimal = {
    id: 0,
    name: '',
    image: 'image',
    minSpeed: 0,
    maxSpeed: 0,
  };
  
  const [animal, setAnimal] = useState({
    id: 0,
    name: '',
    image: 'image',
    minSpeed: 0,
    maxSpeed: 0,
  })
  
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
    console.log("Animal to submit: ", animal)
  
    if(animal.name === '' || animal.minSpeed === 0 || animal.maxSpeed === 0) {
      return alert('Submit failed, please fill out all fields');
    }
    if(animal.minSpeed > animal.maxSpeed) {
      return alert('Submit failed, min speed cannot be greater than max speed');
    }

  
    try {
      console.log('Submitting animal:', animal);
      fetch('https://localhost:7181/api/Animal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animal),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          // Use the server response (data) to update the list
          setAnimals([...animals, data]);
          console.log("animal debug: ", data);
          setAnimal(defaultAnimal); // Reset the form
          alert('Animal created successfully');
          navigate('/animals');
        });
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating animal');
    }
  }
    return (
      <div className="create-animal-section">
      <h1>Create an Animal!</h1>
      <form className="animal-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={animal.name}
          onChange={handleNameChange}
        />
        <input
          type="number"
          placeholder="Min Speed"
          value={animal.minSpeed}
          onChange={handleMinSpeedChange}
        />
        <input
          type="number"
          placeholder="Max Speed"
          value={animal.maxSpeed}
          onChange={handleMaxSpeedChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
    )
  }