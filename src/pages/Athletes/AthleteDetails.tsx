import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Athlete } from '../../interfaces/IAthlete';
import { UserContext } from '../../contexts/UserContext';

export default function AthleteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {user, getAuthToken} = useContext(UserContext);
  const [athlete, setAthlete] = useState<Athlete>({
    athleteId: 0,
    name: '',
    image: 'image',
    slowestTime: 0,
    fastestTime: 0,
  });

  // Fetch athlete data on component mount
  useEffect(() => {
    console.log('Fetching athlete');
    console.log(id);
    fetch(`https://localhost:7181/api/Athlete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
      },
  })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAthlete(data);
      })
      .catch((error) => console.error('Error fetching athlete:', error));
  }, [id]);

  // Handle the deletion of the athlete
  const handleDelete = (athlete: Athlete) => {
    console.log('Deleting athlete:', athlete);
    try {
      fetch(`https://localhost:7181/api/Athlete/${athlete.athleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(athlete),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        })
        .then(() => {
          console.log('Success: Athlete deleted');
          alert('Athlete deleted successfully');
          navigate('/athletes');
        });
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting athlete');
    }
  };

  // Handle the form submission for editing the athlete
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all fields are valid
    if (athlete.name === '' || athlete.fastestTime === 0 || athlete.slowestTime === 0) {
      return alert('Please fill out all fields correctly');
    }
    if (athlete.fastestTime > athlete.slowestTime) {
      return alert('Slowest time cannot be faster than the fastest time');
    }

    try {
      fetch(`https://localhost:7181/api/Athlete/${athlete.athleteId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(athlete),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
        .then((data) => {
          console.log('Success: Athlete updated', data);
          alert('Athlete updated successfully');
          navigate('/athletes'); // Navigate back to the athletes list
        });
    } catch (error) {
      console.error('Error updating athlete:', error);
      alert('Error updating athlete');
    }
  };

  return (
    <div className="athlete-details">
      <h1>Athlete Details</h1>
      <p>Athlete ID: {id}</p>

      {/* Display athlete details (Visible to everyone) */}
      <p>Name: {athlete.name}</p>
      <p>Fastest time: {athlete.fastestTime}</p>
      <p>Slowest time: {athlete.slowestTime}</p>

      {/* Edit Athlete Section (Visible to Admin Only) */}
      {user?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === "Admin" && (
        <div>
          <h2>Edit Athlete</h2>

          <form onSubmit={handleEdit} className="edit-athlete-form">
            <label>Name: </label>
            <input
              type="text"
              placeholder="Name"
              value={athlete.name}
              onChange={(e) => setAthlete({ ...athlete, name: e.target.value })}
            />
            <label>Fastest time: </label>
            <input
              type="number"
              placeholder="Fastest Time"
              value={athlete.fastestTime}
              onChange={(e) =>
                setAthlete({ ...athlete, fastestTime: Number(e.target.value) })
              }
            />
            <label>Slowest time: </label>
            <input
              type="number"
              placeholder="Slowest Speed"
              value={athlete.slowestTime}
              onChange={(e) =>
                setAthlete({ ...athlete, slowestTime: Number(e.target.value) })
              }
            />
            <button type="submit">Update Athlete</button>
          </form>

          {/* Delete button */}
          <button
            className="delete-button"
            onClick={() => handleDelete(athlete)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
