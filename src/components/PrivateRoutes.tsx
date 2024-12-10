import { useContext, useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { jwtDecode } from 'jwt-decode';

export default function PrivateRoutes() {
  const { user, setUser, } = useContext(UserContext);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  

  // User token is used to authenticate the user and grant access to protected routes

  // Check for user token, if not present, redirect to signin page
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        setUser(decodedToken); // Populate the user context
        console.log('USER PRIVATE ROUTE: ', decodedToken);
      } catch (error) {
        console.error('Failed to decode token', error);
        localStorage.removeItem('authToken'); // Clear invalid token
        navigate('/signin'); // Redirect to sign-in if token is invalid
      }
    }
    setLoading(false);
  }, []); // Only run once on component mount

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