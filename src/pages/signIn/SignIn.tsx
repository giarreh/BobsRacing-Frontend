import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "./SignIn.css";

export default function SignIn() {

  const navigate = useNavigate();
  const { user, setUser, getAuthToken, setAuthToken, getUserFromToken } = useContext(UserContext);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    // check for empty fields
    if (form.username === '' || form.password === '') {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('https://localhost:7181/api/User/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setErrorMessage('Unable to login');
        throw new Error('Unable to login');
      }

      //everything is good
      const data = await response.json();
      console.log("SETTING USER WITH DATA: ",data);
      setUser(data);
      setAuthToken(data.token);
      navigate('/athletes');
    } catch (error) {
      console.error('Unable to login:', error);

    }


  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={form.username}
            onChange={(e) => setForm({...form, username: e.target.value})}
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            placeholder="Enter your password"
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <a href="/signup" style={{ cursor: "pointer" }}>
          Sign up
        </a>
      </p>
    </div>
  );
}
