import { useEffect, useState } from "react";

import Pagination from "./Pagination";
import AddBike from "./AddBike";
import EditBike from "./EditBike";
import DeleteBike from "./DeleteBike";

const BikeList = ({ userRole, filters }) => {
  const [bikes, setBikes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [editingBikeId, setEditingBikeId] = useState(null);

  const limit = 10;

  const fetchBikes = async (pageNumber) => {
    try {
      const params = new URLSearchParams();

      if (filters.name) {
        params.append("name", filters.name);
      }

      if (filters.color) {
        params.append("color", filters.color);
      }

      if (filters.location) {
        params.append("location", filters.location);
      }

      if (filters.minRating) {
        params.append("minRating", filters.minRating);
      }

      if (filters.fromDate && filters.toDate) {
        params.append("fromDate", filters.fromDate);

        params.append("toDate", filters.toDate);
      }

      params.append("page", pageNumber);

      params.append("limit", limit);

      const response = await fetch(`/bikes?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Failed to fetch bikes");
        return;
      }

      setBikes(data.data || []);

      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Unable to connect to server");
    }
  };

  // =========================
  // FETCH WHEN PAGE CHANGES
  // =========================

  useEffect(() => {
    fetchBikes(currentPage);
  }, [
    currentPage,
    filters.name,
    filters.color,
    filters.location,
    filters.minRating,
    filters.fromDate,
    filters.toDate,
  ]);

  // =========================
  // EDIT
  // =========================

  const handleEdit = (bike) => {
    setEditingBikeId(bike._id);
  };

  const handleCancelEdit = () => {
    setEditingBikeId(null);
  };

  // =========================
  // BOOK NOW
  // =========================

  const handleBookNow = (bike) => {
    console.log("Book bike:", bike);

    console.log("From Date:", filters.fromDate);

    console.log("To Date:", filters.toDate);
  };

  return (
    <div className="bike-section">
      {/* =========================
                ADD BIKE
            ========================= */}

      {userRole === "manager" && (
        <AddBike onBikeAdded={() => fetchBikes(currentPage)} />
      )}

      {/* =========================
                BIKE LIST
            ========================= */}

      <div className="bike-list">
        {bikes.length === 0 ? (
          <p>No bikes found</p>
        ) : (
          bikes.map((bike) => (
            <div className="bike-card" key={bike._id}>
              {/* EDIT MODE */}

              {editingBikeId === bike._id ? (
                <EditBike
                  bike={bike}
                  onBikeUpdated={() => {
                    setEditingBikeId(null);

                    fetchBikes(currentPage);
                  }}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <>
                  <h3>{bike.name}</h3>

                  <p>
                    <strong>Color:</strong> {bike.color}
                  </p>

                  <p>
                    <strong>Location:</strong> {bike.location}
                  </p>

                  <p>
                    <strong>Rating:</strong> {bike.rating}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {bike.isAvailable ? "Available" : "Not Available"}
                  </p>

                  {/* BOOK NOW */}

                  {filters.fromDate && filters.toDate && bike.isAvailable && (
                    <button
                      className="book-now-button"
                      onClick={() => handleBookNow(bike)}
                    >
                      Book Now
                    </button>
                  )}
                  {userRole === "manager" && (
                    <div className="bike-card-actions">
                      <button onClick={() => handleEdit(bike)}>Edit</button>

                      <DeleteBike
                        bikeId={bike._id}
                        onBikeDeleted={() => fetchBikes(currentPage)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default BikeList;
