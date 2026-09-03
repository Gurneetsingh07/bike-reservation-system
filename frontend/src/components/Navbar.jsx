import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Navbar = ({ isLoggedIn = false, setIsLoggedIn = () => {} }) => {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.userRole);
  const handleHome = () => {
    navigate("/");
  };

  const handleReservation = () => {
    if (isLoggedIn) {
      navigate("/reservation");
    } else {
      navigate("/login");
    }
  };
  const handleUsers = () => {
    if (isLoggedIn && userRole === "manager") {
      navigate("/users");
    }
  };
  const handleLogout = async () => {
    if (!isLoggedIn) return;

    try {
      const response = await fetch("/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button onClick={handleHome}>Home</button>
        <button onClick={handleReservation}>Reservations</button>
        {userRole === "manager" && <button onClick={handleUsers}>Users</button>}
      </div>

      <div className="navbar-right">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
