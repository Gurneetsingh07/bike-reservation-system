import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login"

import Signup from "./Pages/Signup"
import Home from "./Pages/Home"
import Reservation from "./Pages/Reservation"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="*" element={<Navigate to="/login" replace/>}/>
    </Routes>
  );
}

export default App;
