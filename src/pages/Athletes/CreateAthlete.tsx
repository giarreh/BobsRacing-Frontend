import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Athletes.css";
import { Athlete } from "../../interfaces/IAthlete";
import { UserContext } from "../../contexts/UserContext";
import { AppContext } from "../../contexts/AppContext";

export default function CreateAthlete() {

  const navigate = useNavigate();
  const {getAuthToken} = useContext(UserContext);
  const {athletes, setAthletes} = useContext(AppContext);

  const defaultAthlete = {
    athleteId: 0,
    name: 'name',
    image: 'image',
    slowestTime: 0,
    fastestTime: 0
  };

  const [athlete, setAthlete] = useState<Athlete>({
    athleteId: 0,
    name: 'name',
    image: 'image',
    slowestTime: 0,
    fastestTime: 0
  })
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAthlete({ ...athlete, name: e.target.value });
  };

  const handleMinSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAthlete({...athlete, slowestTime: parseFloat(e.target.value)})
  }
  
  const handleMaxSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAthlete({...athlete,fastestTime: parseFloat(e.target.value)})
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Athlete to submit: ", athlete);

    // Check if all fields are valid
    if (athlete.name === '' || athlete.fastestTime === 0 || athlete.slowestTime === 0) {
      return alert('Please fill out all fields correctly');
    }
    if (athlete.fastestTime > athlete.slowestTime) {
      return alert('Slowest time cannot be faster than the fastest time');
    }

    try {
      console.log("Submitting athlete:", athlete);
      fetch("https://localhost:7181/api/Athlete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(athlete),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          // Use the server response (data) to update the list
          setAthletes([...athletes, data]);
          console.log("athlete debug: ", data);
          setAthlete(defaultAthlete); // Reset the form
          alert("Athlete created successfully");
          navigate("/athletes");
        });
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating athlete");
    }
  };
  return (
    <>
      <form className="athlete-form" onSubmit={handleSubmit}>
        <label>Name: </label>
        <input
          type="text"
          placeholder="Name"
          value={athlete.name}
          onChange={handleNameChange}
        />
        <label>Slowest time: </label>
        <input
          type="number"
          placeholder="Slowest time"
          value={athlete.slowestTime}
          onChange={handleMinSpeedChange}
        />
        <label>Fastest time: </label>
        <input
          type="number"
          placeholder="Fastest time"
          value={athlete.fastestTime}
          onChange={handleMaxSpeedChange}
        />
      </form>
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </>
  );
}
