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
      {user ? (
        <>
          {/* Left side: Home, Profile, Race, Betting, Athletes (if admin) */}
          <div className="header-left">
            <div onClick={() => navigate("/")}>Home</div>
            <div onClick={() => navigate("/profile")}>Profile</div>
            <div onClick={() => navigate("/race")}>Races</div>
            <div /*onClick={() => navigate("/")} */>Betting</div>
              <div onClick={() => navigate("/athletes")}>Athletes</div>
          </div>
          {/* Right side: Logout */}
          <div className="header-right header-logout-div">
            <p
              onClick={() => {
                clearAuthToken();
                setUser(null);
                navigate("/signin");
              }}
            >
              LOGOUT
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Left side: Empty */}
          <div className="header-left"></div>
          {/* Right side: Login/Register */}
          <div className="header-right header-login-div">
            <p onClick={() => navigate("/signin")}>LOGIN</p>
            <p onClick={() => navigate("/signup")}>REGISTER</p>
          </div>
        </>
      )}
    </header>
  );
}