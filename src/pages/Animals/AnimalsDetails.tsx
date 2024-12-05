import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Animal } from '../../interfaces/IAnimal'

export default function AnimalsDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [animal, setAnimal] = useState<Animal>(
    {
      animalId: 0,
      name: '',
      minSpeed: 0,
      maxSpeed: 0,
      image: '',
    }
  )

  useEffect(() => {
    console.log('Fetching animals')
    console.log(id)
    fetch(`https://localhost:7181/api/Animal/${id}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setAnimal(data);
    })
  }, [id])

  const handleDelete = (animal: Animal) => {
    console.log('Deleting animal:', animal);
    try {
      fetch(`https://localhost:7181/api/Animal/${animal.animalId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animal),
      })
      .then(response => 
      {
        if(!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      )
      .then(data => {
        console.log('Success:', data);
        alert('Animal deleted successfully');
        navigate('/animals');
      })
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting animal');
  }}


  return (
    <div className='animal-details'>
      <h1>Animal Details</h1>
      <p>Animal ID: {id}</p>
      <p>Animal Name: {animal.name} </p>
      <p>Min Speed: {animal.minSpeed}</p>
      <p>Max Speed: {animal.maxSpeed}</p>
      <button className='animal-form-button' onClick={() => handleDelete(animal)}>Delete</button>
    </div>
  )
}
