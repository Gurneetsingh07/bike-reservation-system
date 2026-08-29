import React, { useState } from "react";
import { toast } from "react-toastify";

const AddBike = ({ onBikeAdded }) => {
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    color: "",
    location: "",
    isAvailable: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "isAvailable" ? value === "true" : value,
    }));
  };

  const handleAddBike = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.color.trim() || !form.location.trim()) {
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
          name: form.name,
          color: form.color,
          location: form.location,
          isAvailable: form.isAvailable,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to add bike");
        return;
      }

      toast.success(data.message || "Bike added successfully");

      setForm({
        name: "",
        color: "",
        location: "",
        isAvailable: true,
      });

      setShowForm(false);

      onBikeAdded();
    } catch (error) {
      toast.error("Unable to connect to server");
    }
  };

  const handleCancel = () => {
    setShowForm(false);

    setForm({
      name: "",
      color: "",
      location: "",
      isAvailable: true,
    });
  };

  return (
    <div className="add-bike-container">
      {!showForm && (
        <button className="add-bike-button" onClick={() => setShowForm(true)}>
          Add Bike
        </button>
      )}

      {showForm && (
        <div className="add-bike-form">
          <h2>Add Bike</h2>

          <label>Name</label>

          <input
            type="text"
            name="name"
            placeholder="Bike name"
            value={form.name}
            onChange={handleChange}
          />

          <label>Color</label>

          <input
            type="text"
            name="color"
            placeholder="Color"
            value={form.color}
            onChange={handleChange}
          />

          <label>Location</label>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <label>Availability</label>

          <select
            name="isAvailable"
            value={form.isAvailable}
            onChange={handleChange}
          >
            <option value="true">Available</option>

            <option value="false">Not Available</option>
          </select>

          <div className="bike-card-actions">
            <button onClick={handleAddBike}>Add</button>

            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBike;
