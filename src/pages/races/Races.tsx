import React from 'react'
import { useNavigate } from 'react-router'

export default function Races() {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate("/createrace")}>
      Create a race
    </div>
  )
}
