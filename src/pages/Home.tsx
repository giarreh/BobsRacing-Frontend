import { useContext } from 'react';
import { useNavigate } from 'react-router'
import { UserContext } from '../contexts/UserContext';

export default function Home() {
  const navigate = useNavigate();
  const { user, getUserFromToken }  = useContext(UserContext);

  if(user === undefined) {
    navigate('/signin');
  }


  return (
    <div>
      <h1 onClick={() => navigate('/races')}>Click here to go to racing</h1>
      <h1 onClick={() => navigate('/athletes')}>Click here to go to athletes</h1>
      <h1 onClick={() => console.log(user)}>Console log user</h1>
      <h1 onClick={() => console.log(getUserFromToken())}>Get user from token</h1>

      <div>
        <h1>User information</h1>
        <p>Username: {user?.username}</p>
        <p>Profile name: {user?.profilename}</p>
        <p>Id: {user?.id}</p>
        <p>Role: {user?.role}</p>
        <p>Credits: {user?.credits}</p>
      </div>

    </div>
  )
}
