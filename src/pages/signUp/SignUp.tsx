import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css"

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added for password confirmation
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    // Here you would typically call an API to create a new user account
    if (username && password) {
      // On successful signup, navigate to the login page (or any other page)
      navigate("/login");
    } else {
      setErrorMessage("Please fill in all fields.");
    }
  };

  return (
    <>
      <div className="signup-page">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp} className="signup-form">
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account?{" "}
          <a href="/signin" style={{ cursor: "pointer" }}>
            Sign in
          </a>
        </p>
      </div>
    </>
  );
}
