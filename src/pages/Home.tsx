import React from 'react'
import { useNavigate } from 'react-router'

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 onClick={() => navigate('/race')}>Click here to go to racing</h1>
      <h1 onClick={() => navigate('/animals')}>Click here to go to animals</h1>
    </div>
  )
}
