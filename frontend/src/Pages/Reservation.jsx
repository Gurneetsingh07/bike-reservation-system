import React from 'react'
import Navbar from '../components/Navbar'

const Reservation = () => {
  return (
    <>
      <Navbar isLoggedIn={true} />
      <div style={{ padding: '2rem' }}>
        <h1>Reservation Page</h1>
        <p>This is where reservations will go.</p>
      </div>
    </>
  )
}

export default Reservation
