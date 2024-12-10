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
      <h1 onClick={() => navigate('/race')}>Click here to go to racing</h1>
      <h1 onClick={() => navigate('/athletes')}>Click here to go to athletes</h1>
      <h1 onClick={() => console.log(user)}>Console log user</h1>
      <h1 onClick={() => console.log(getUserFromToken())}>Get user from token</h1>

    </div>
  )
}
