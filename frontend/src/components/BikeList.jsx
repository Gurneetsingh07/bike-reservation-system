import React, { useEffect, useState } from "react";

const BikeList = ({ userRole, filters }) => {
    const [bikes, setBikes] = useState([]);

    useEffect(() => {
        const fetchBikes = async () => {
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

                const url = `/bikes?${params.toString()}`;

                console.log("Fetching:", url);

                const response = await fetch(url, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error(
                        data.message || "Failed to fetch bikes"
                    );
                    return;
                }

                setBikes(data.data || []);

            } catch (error) {
                console.error("Unable to connect to server");
            }
        };

        fetchBikes();

    }, [
        filters.name,
        filters.color,
        filters.location,
        filters.minRating,
        filters.fromDate,
        filters.toDate,
    ]);

    const handleDelete = async (bikeId) => {
        try {
            const response = await fetch(`/bikes/${bikeId}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to delete bike");
                return;
            }

            setBikes((prev) =>
                prev.filter((bike) => bike._id !== bikeId)
            );

        } catch (error) {
            alert("Unable to connect to server");
        }
    };

    const handleEdit = (bike) => {
        console.log("Edit bike:", bike);
    };

    return (
        <div className="bike-list">

            {bikes.length === 0 ? (
                <p>No bikes found</p>
            ) : (
                bikes.map((bike) => (
                    <div className="bike-card" key={bike._id}>

                        <h3>{bike.name}</h3>

                        <p>
                            <strong>Color:</strong>{" "}
                            {bike.color}
                        </p>

                        <p>
                            <strong>Location:</strong>{" "}
                            {bike.location}
                        </p>

                        <p>
                            <strong>Rating:</strong>{" "}
                            {bike.rating}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {bike.isAvailable
                                ? "Available"
                                : "Not Available"}
                        </p>

                        {userRole === "manager" && (
                            <div className="bike-card-actions">

                                <button
                                    onClick={() =>
                                        handleEdit(bike)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(bike._id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>
                        )}

                    </div>
                ))
            )}

        </div>
    );
};

export default BikeList;