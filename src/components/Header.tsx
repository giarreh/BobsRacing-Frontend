import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
//import logo from '../assets/Bobs_Bakery.svg';
//import ProfilePicture from './profiles/ProfilePicture';

export default function Header() {
  const { user, setUser, clearAuthToken } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div>
        <div
          className="header-home-div"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Home
        </div>
      </div>
      <div>
        {user ? (
          <div className="header-logout-div">
            <p
              className="header-home-div"
              style={{ cursor: "pointer" }}
              onClick={() => {
                clearAuthToken();
                setUser(null);
                navigate("/signin");
              }}
            >
              LOGOUT
            </p>
          </div>
        ) : (
          <div className="header-login-div">
            <p onClick={() => navigate("/signin")}>LOGIN</p>
            <p onClick={() => navigate("/signup")}>REGISTER</p>
          </div>
        )}
      </div>
    </header>
  );
}