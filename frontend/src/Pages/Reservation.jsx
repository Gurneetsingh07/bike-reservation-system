import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const location = useLocation();
  const userRole = useSelector((state) => state.user.userRole);

  const fetchReservations = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const userId = searchParams.get("userId");
      const bikeId = searchParams.get("bikeId");

      const query = new URLSearchParams();
      if (userId) query.append("userId", userId);
      if (bikeId) query.append("bikeId", bikeId);

      const url = query.toString()
        ? `/reservations/my?${query.toString()}`
        : "/reservations/my";

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to fetch reservations");
        setReservations([]);
        return;
      }

      setReservations(data.reservations || []);
    } catch (error) {
      toast.error("Unable to connect to server");
      setReservations([]);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [location.search]);

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`/reservations/cancel/${reservationId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to cancel reservation");
        return;
      }

      toast.success(data.message || "Reservation cancelled successfully");
      fetchReservations();
    } catch (error) {
      toast.error("Unable to connect to server");
    }
  };

  const handleRateReservation = async (reservationId, rating) => {
    try {
      const response = await fetch(`/reservations/rate/${reservationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ rating }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to rate reservation");
        return;
      }

      toast.success(data.message || "Reservation rated successfully");
      fetchReservations();
    } catch (error) {
      toast.error("Unable to connect to server");
    }
  };

  const searchParams = new URLSearchParams(location.search);
  const filteredUserId = searchParams.get("userId");
  const filteredBikeId = searchParams.get("bikeId");
  const isManagerFilteredView =
    userRole === "manager" && (filteredUserId || filteredBikeId);

  const visibleReservations = reservations.filter(
    (reservation) => reservation.status !== "cancelled",
  );

  return (
    <>
      <Navbar isLoggedIn={true} />

      <div className="reservation-page">
        <h2>
          {isManagerFilteredView ? "Filtered Reservations" : "My Reservations"}
        </h2>

        {filteredUserId && (
          <p>
            <strong>User Filter:</strong> {filteredUserId}
          </p>
        )}

        {filteredBikeId && (
          <p>
            <strong>Bike Filter:</strong> {filteredBikeId}
          </p>
        )}

        {visibleReservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <div className="reservation-list">
            {visibleReservations.map((reservation) => (
              <div className="reservation-card" key={reservation._id}>
                <h3>{reservation.bike?.name || "Deleted Bike"}</h3>

                <p>
                  <strong>Color:</strong> {reservation.bike?.color || "Deleted"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {reservation.bike?.location || "Deleted"}
                </p>

                <p>
                  <strong>Bike Rating:</strong>{" "}
                  {reservation.bike?.rating ?? "Deleted"}
                </p>

                {isManagerFilteredView && (
                  <p>
                    <strong>User:</strong> {reservation.user?.email || "N/A"}
                  </p>
                )}

                <p>
                  <strong>From:</strong>{" "}
                  {new Date(reservation.fromDate).toLocaleDateString()}
                </p>

                <p>
                  <strong>To:</strong>{" "}
                  {new Date(reservation.toDate).toLocaleDateString()}
                </p>

                <p>
                  <strong>Status:</strong> {reservation.status}
                </p>

                <p>
                  <strong>Your Rating:</strong>{" "}
                  {reservation.rating ?? "Not rated yet"}
                </p>

                <div className="reservation-actions">
                  {reservation.status === "active" && (
                    <button
                      onClick={() => handleCancelReservation(reservation._id)}
                    >
                      Cancel Reservation
                    </button>
                  )}

                  {reservation.status === "active" &&
                    (reservation.rating === null ||
                      reservation.rating === undefined) && (
                      <div>
                        <p>Rate this reservation:</p>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            onClick={() =>
                              handleRateReservation(reservation._id, value)
                            }
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Reservation;
