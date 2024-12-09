import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import './Athletes.css'
import { Athlete } from '../../interfaces/IAthlete';

export default function CreateAthlete({ athletes, setAthletes }: any) {


  const navigate = useNavigate();

  const defaultAthlete = {
    athleteId: 0,
    name: 'string',
    image: 'string',
    lowestTime: 0,
    fastestTime: 0
  };
  
  const [athlete, setAthlete] = useState<Athlete>({
    athleteId: 0,
    name: 'name',
    image: 'string',
    lowestTime: 0,
    fastestTime: 0
  })
  
  const handleNameChange = (e: any) => {
    setAthlete({...athlete, name: e.target.value})
  }
  
  const handleMinSpeedChange = (e: any) => {
    setAthlete({...athlete, fastestTime: e.target.value})
  }
  
  const handleMaxSpeedChange = (e: any) => {
    setAthlete({...athlete, lowestTime: e.target.value})
  }
  
  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log("Athlete to submit: ", athlete)
  
    // Check if all fields are valid
    if (athlete.name === '' || athlete.fastestTime === 0 || athlete.lowestTime === 0) {
      return alert('Please fill out all fields correctly');
    }
    if (athlete.fastestTime > athlete.lowestTime) {
      return alert('Slowest time cannot be faster than the fastest time');
    }

  
    try {
      console.log('Submitting athlete:', athlete);
      fetch('https://localhost:7181/api/Athlete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(athlete),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          // Use the server response (data) to update the list
          setAthletes([...athletes, data]);
          console.log("athlete debug: ", data);
          setAthlete(defaultAthlete); // Reset the form
          alert('Athlete created successfully');
          navigate('/athletes');
        });
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating athlete');
    }
  }
    return (
      <div className="create-animal-section">
      <h1>Create an Athlete!</h1>
      <form className="animal-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={athlete.name}
          onChange={handleNameChange}
        />
        <input
          type="number"
          placeholder="Slowest time"
          value={athlete.fastestTime}
          onChange={handleMinSpeedChange}
        />
        <input
          type="number"
          placeholder="Fastest time"
          value={athlete.lowestTime}
          onChange={handleMaxSpeedChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
    )
  }