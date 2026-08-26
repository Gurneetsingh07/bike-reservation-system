import { useState } from 'react';
import Navbar from '../components/Navbar'
import BikeList from "../components/BikeList"
import { useSelector } from "react-redux";
import FilterPanel from "../components/FilterPanel";
const Home = () => {
  const userRole = useSelector((state) => state.user.userRole);
  const [filters, setFilters] = useState({
    name: "",
    color: "",
    location: "",
    minRating: "",
    fromDate: "",
    toDate: "",
  });
  return (
    <>
      <Navbar isLoggedIn={true} />

      <div className="home-container">

        <div className="filter-section">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        <div className="bike-section">
          <BikeList
            userRole={userRole}
            filters={filters}
          />
        </div>

      </div>
    </>
  )
}

export default Home