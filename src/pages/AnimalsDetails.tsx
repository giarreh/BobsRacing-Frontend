import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Animal } from '../interfaces/IAnimal'

export default function AnimalsDetails() {

  const { id } = useParams()

  const [animal, setAnimal] = useState<Animal>(
    {
      name: '',
      minSpeed: 0,
      maxSpeed: 0
    }
  )

  useEffect(() => {
    console.log('Fetching animals')
    fetch(`http://localhost:5238/api/Animal/${id}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setAnimal(data);
    })
  }, [id])

  return (
    <div>
      <h1>Animal Details</h1>
      <p>Animal ID: {id}</p>
      <p>Animal Name: {animal.name} </p>
      <p>Min Speed: {animal.minSpeed}</p>
      <p>Max Speed: {animal.maxSpeed}</p>
    </div>
  )
}
