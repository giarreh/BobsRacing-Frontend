import React from 'react'
import { useNavigate } from 'react-router'

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 onClick={() => navigate('/race')}>Click here to go to racing</h1>
      <h1 onClick={() => navigate('/athletes')}>Click here to go to athletes</h1>
    </div>
  )
}
