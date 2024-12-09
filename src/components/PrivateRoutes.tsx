import { useContext, useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default function PrivateRoutes() {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true); 
  
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');


  // User token is used to authenticate the user and grant access to protected routes

  // Check for user token, if not present, redirect to signin page
  useEffect(() => {
    if (token) {
      //const decodedToken = jwtDecode(token);
      console.log("TOKEN: ", token)
      //console.log("DECODED TOKEN: ", decodedToken);
      //setUser(decodedToken);
    }
    setLoading(false); 
  }, [token]);

  if (loading) {
    if(user === undefined) {
      navigate('/signin');
    }
    return <p>Loading...</p>; 
  }

  return (
    user ? <Outlet /> : <Navigate to="/signin" />
  );
}