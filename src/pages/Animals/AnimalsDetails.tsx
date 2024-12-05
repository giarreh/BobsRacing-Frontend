import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Animal } from '../../interfaces/IAnimal';

export default function AnimalsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState<Animal>({
    animalId: 0,
    name: '',
    minSpeed: 0,
    maxSpeed: 0,
    image: '',
  });

  // Fetch animal data on component mount
  useEffect(() => {
    console.log('Fetching animal');
    console.log(id);
    fetch(`https://localhost:7181/api/Animal/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAnimal(data);
      })
      .catch((error) => console.error('Error fetching animal:', error));
  }, [id]);

  // Handle the deletion of the animal
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
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        })
        .then(() => {
          console.log('Success: Animal deleted');
          alert('Animal deleted successfully');
          navigate('/animals');
        });
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting animal');
    }
  };

  // Handle the form submission for editing the animal
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all fields are valid
    if (animal.name === '' || animal.minSpeed === 0 || animal.maxSpeed === 0) {
      return alert('Please fill out all fields correctly');
    }
    if (animal.minSpeed > animal.maxSpeed) {
      return alert('Min Speed cannot be greater than Max Speed');
    }

    try {
      fetch(`https://localhost:7181/api/Animal/${animal.animalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animal),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
        .then((data) => {
          console.log('Success: Animal updated', data);
          alert('Animal updated successfully');
          navigate('/animals'); // Navigate back to the animals list
        });
    } catch (error) {
      console.error('Error updating animal:', error);
      alert('Error updating animal');
    }
  };

  return (
    <div className="animal-details">
      <h1>Animal Details</h1>
      <p>Animal ID: {id}</p>

      {/* Display animal details */}
      <p>Animal Name: {animal.name}</p>
      <p>Min Speed: {animal.minSpeed}</p>
      <p>Max Speed: {animal.maxSpeed}</p>

      {/* Edit Animal Form */}
      <h2>Edit Animal</h2>
      <form onSubmit={handleEdit} className="edit-animal-form">
        <input
          type="text"
          placeholder="Name"
          value={animal.name}
          onChange={(e) => setAnimal({ ...animal, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min Speed"
          value={animal.minSpeed}
          onChange={(e) => setAnimal({ ...animal, minSpeed: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Max Speed"
          value={animal.maxSpeed}
          onChange={(e) => setAnimal({ ...animal, maxSpeed: Number(e.target.value) })}
        />
        <button type="submit">Update Animal</button>
      </form>

      {/* Delete button */}
      <button className="delete-button" onClick={() => handleDelete(animal)}>
        Delete
      </button>
    </div>
  );
}
