import { useEffect, useState, useRef , useCallback } from "react";
import Pagination from "./Pagination";
import AddBike from "./AddBike";
import EditBike from "./EditBike";
import DeleteBike from "./DeleteBike";

const BikeList = ({ userRole, filters }) => {
  const [bikes, setBikes] = useState([]);
  const [showReservations, setShowReservations] = useState(false);
  const [bikeReservations, setBikeReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [editingBikeId, setEditingBikeId] = useState(null);

  const limit = 10;
  const filterKey = JSON.stringify(filters);
  const previousFilterKey = useRef(filterKey);

  const fetchBikes = useCallback(async (pageNumber) => {
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

      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Unable to connect to server");
    }
  },[filters,limit]);

  useEffect(() => {
    if (previousFilterKey.current !== filterKey) {
      previousFilterKey.current = filterKey;
      if (currentPage !== 1) {
        setCurrentPage(1);
        return;
      }
      fetchBikes(1);
      return;
    }
    fetchBikes(currentPage);
  }, [fetchBikes, currentPage, filterKey]);

  const handleEdit = (bike) => {
    setEditingBikeId(bike._id);
  };

  const handleCancelEdit = () => {
    setEditingBikeId(null);
  };

  const handleBookNow = (bike) => {
    console.log("Book bike:", bike);

    console.log("From Date:", filters.fromDate);

    console.log("To Date:", filters.toDate);
  };
  const handleViewReservations = async (bikeId) => {
    try {
      const response = await fetch(`/reservations/bike/${bikeId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Failed to fetch reservations");
        return;
      }

      setBikeReservations(data.reservations || []);
      setShowReservations(true);
    } catch (error) {
      console.error("Unable to connect to server");
    }
  };

  return (
    <div className="bike-section">
      {userRole === "manager" && (
        <AddBike onBikeAdded={() => fetchBikes(currentPage)} />
      )}

      <div className="bike-list">
        {bikes.length === 0 ? (
          <p>No bikes found</p>
        ) : (
          bikes.map((bike) => (
            <div className="bike-card" key={bike._id}>
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
                      <button onClick={() => handleViewReservations(bike._id)}>
                        View Reservations
                      </button>
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
      {showReservations && (
        <div
          className="reservations-modal"
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -20%)",
            backgroundColor: "#fff",
            padding: "20px",
            border: "1px solid #ccc",
            zIndex: 1000,
            maxHeight: "60vh",
            overflowY: "auto",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="reservations-modal-content">
            <h3>Bike Reservations</h3>
            <button
              onClick={() => setShowReservations(false)}
              style={{ marginBottom: "10px", float: "right" }}
            >
              Close
            </button>

            {bikeReservations.length === 0 ? (
              <p>No reservations found for this bike.</p>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {bikeReservations.map((res) => (
                  <li
                    key={res._id}
                    style={{
                      borderBottom: "1px solid #eee",
                      paddingBottom: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <p>
                      <strong>Status:</strong> {res.status}
                    </p>
                    <p>
                      <strong>From:</strong>{" "}
                      {new Date(res.fromDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>To:</strong>{" "}
                      {new Date(res.toDate).toLocaleDateString()}
                    </p>
                    {res.user && (
                      <p>
                        <strong>User:</strong> {res.user.name} ({res.user.email}
                        )
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BikeList;
