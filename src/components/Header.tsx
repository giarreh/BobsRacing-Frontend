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
        <div style={{ cursor: 'pointer' }} onClick={() => navigate("/")}>
          Home
        </div>
      </div>
      <div>
        {user ? (
          <div>
            <p style={{ cursor: 'pointer' }} onClick={() => {clearAuthToken(); setUser(null);}}>LOGOUT</p>
          </div>
        ) : (
          <div>
            <p>LOGIN</p>
            <p>REGISTER</p>
          </div>
        )}
      </div>
    </header>
  );
}