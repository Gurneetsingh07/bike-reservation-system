import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
const BikeList = ({ userRole, filters }) => {
  const [bikes, setBikes] = useState([]);

  const [editingBikeId, setEditingBikeId] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    color: "",
    location: "",
    isAvailable: true,
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const [addForm, setAddForm] = useState({
    name: "",
    color: "",
    location: "",
    isAvailable: true,
  });
  const fetchBikes = useCallback(async () => {
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

      const queryString = params.toString();

      const url = queryString ? `/bikes?${queryString}` : "/bikes";

      console.log("Fetching:", url);

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Failed to fetch bikes");
        return;
      }

      setBikes(data.data || []);
    } catch (error) {
      console.error("Unable to connect to server");
    }
  }, [
    filters.name,
    filters.color,
    filters.location,
    filters.minRating,
    filters.fromDate,
    filters.toDate,
  ]);

  useEffect(() => {
    fetchBikes();
  }, [fetchBikes]);

  const handleAddChange = (e) => {
    const { name, value } = e.target;

    setAddForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddBike = async (e) => {
    e.preventDefault();

    if (
        !addForm.name.trim() ||
        !addForm.color.trim() ||
        !addForm.location.trim()
    ) {
        toast.error("Name, color and location are required");
        return;
    }

    try {
        const response = await fetch("/bikes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                name: addForm.name,
                color: addForm.color,
                location: addForm.location,
                isAvailable: addForm.isAvailable === "true",
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            toast.error(data.message || "Failed to add bike");
            return;
        }

        toast.success(data.message || "Bike added successfully");

        setShowAddForm(false);

        setAddForm({
            name: "",
            color: "",
            location: "",
            isAvailable: true,
        });

        await fetchBikes();

    } catch (error) {
        toast.error("Unable to connect to server");
    }
};
  const handleCancelAdd = () => {
    setShowAddForm(false);
    setAddForm({
      name: "",
      color: "",
      location: "",
    });
  };
  const handleEdit = (bike) => {
    setEditingBikeId(bike._id);

    setEditForm({
      name: bike.name,
      color: bike.color,
      location: bike.location,
      isAvailable: bike.isAvailable,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: name === "isAvailable" ? value === "true" : value,
    }));
  };

  const handleSaveEdit = async (bikeId) => {
    if (
        !editForm.name.trim() ||
        !editForm.color.trim() ||
        !editForm.location.trim()
    ) {
        toast.error("Name, color and location are required");
        return;
    }

    try {
        const response = await fetch(`/bikes/${bikeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                name: editForm.name,
                color: editForm.color,
                location: editForm.location,
                isAvailable: editForm.isAvailable,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            toast.error(data.message || "Failed to update bike");
            return;
        }

        toast.success(
            data.message || "Bike updated successfully"
        );

        setEditingBikeId(null);

        setEditForm({
            name: "",
            color: "",
            location: "",
            isAvailable: true,
        });

        await fetchBikes();

    } catch (error) {
        toast.error("Unable to connect to server");
    }
};
  const handleCancelEdit = () => {
    setEditingBikeId(null);

    setEditForm({
      name: "",
      color: "",
      location: "",
    });
  };
  const handleDelete = async (bikeId) => {
    try {
        const response = await fetch(`/bikes/${bikeId}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            toast.error(data.message || "Failed to delete bike");
            return;
        }

        toast.success(
            data.message || "Bike deleted successfully"
        );

        await fetchBikes();

    } catch (error) {
        toast.error("Unable to connect to server");
    }
};

  const handleBookNow = (bike) => {
    console.log("Book bike:", bike);
    console.log("From Date:", filters.fromDate);
    console.log("To Date:", filters.toDate);
  };

  return (
    <div className="bike-section">
      {userRole === "manager" && (
        <button onClick={() => setShowAddForm(true)}>Add Bike</button>
      )}

      {userRole === "manager" && showAddForm && (
        <div className="add-bike-form">
          <h2>Add Bike</h2>
          <input
            type="text"
            name="name"
            placeholder="Bike name"
            value={addForm.name}
            onChange={handleAddChange}
          />

          <input
            type="text"
            name="color"
            placeholder="Color"
            value={addForm.color}
            onChange={handleAddChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={addForm.location}
            onChange={handleAddChange}
          />
          <select
            name="isAvailable"
            value={addForm.isAvailable}
            onChange={handleAddChange}
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
          <div className="bike-card-actions">
            <button onClick={handleAddBike}>Add</button>

            <button onClick={handleCancelAdd}>Cancel</button>
          </div>
        </div>
      )}
      <div className="bike-list">
        {bikes.length === 0 ? (
          <p>No bikes found</p>
        ) : (
          bikes.map((bike) => (
            <div className="bike-card" key={bike._id}>
              {editingBikeId === bike._id ? (
                <>
                  <h3>Edit Bike</h3>

                  <label>Name</label>

                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                  />

                  <label>Color</label>

                  <input
                    type="text"
                    name="color"
                    value={editForm.color}
                    onChange={handleEditChange}
                  />

                  <label>Location</label>

                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                  />
                  <label>Availability</label>
                  <select
                    name="isAvailable"
                    value={editForm.isAvailable}
                    onChange={handleEditChange}
                  >
                    <option value={true}>Available</option>
                    <option value={false}>Not Available</option>
                  </select>
                  <div className="bike-card-actions">
                    <button onClick={() => handleSaveEdit(bike._id)}>
                      Save
                    </button>

                    <button onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </>
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

                      <button onClick={() => handleDelete(bike._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BikeList;
