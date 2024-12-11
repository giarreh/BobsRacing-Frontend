import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css"

export default function SignUp() {
  const [form, setForm] = useState({
    profilename: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async(e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    //if name contains spaces
    if (form.username.includes(" ")) {
      setErrorMessage("Profile name cannot contain spaces.");
      return;
    }


    // Here you would typically call an API to create a new user account
    if (form.username === '' || form.password === '' || form.confirmPassword === '') {
      setErrorMessage("Please fill in all fields.");
      return;
    };

    try {
      const response = await fetch('https://localhost:7181/api/User/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Unable to sign up');
      }
      console.log("USER: ",form)
      console.log("RESPONSE: ",response)
      navigate('/login');
    } catch (error) {
      console.error('Unable to sign up:', error);
    }
  };

  return (
    <>
      <div className="signup">
        <div className="signup-page">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUp} className="signup-form">
            <div>
              <label htmlFor="profilename">Display name</label>
              <input
                type="text"
                id="profilename"
                value={form.profilename}
                onChange={(e) =>
                  setForm({ ...form, profilename: e.target.value })
                }
                placeholder="Enter your display name"
                required
              />
            </div>
            <div>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Enter your username for login"
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
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
      </div>
    </>
  );
}
