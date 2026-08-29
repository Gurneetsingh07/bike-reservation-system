import React, { useState } from "react";
import { toast } from "react-toastify";

const EditBike = ({ bike, onBikeUpdated, onCancel }) => {
  const [form, setForm] = useState({
    name: bike.name,
    color: bike.color,
    location: bike.location,
    isAvailable: bike.isAvailable,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "isAvailable" ? value === "true" : value,
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.color.trim() || !form.location.trim()) {
      toast.error("Name, color and location are required");
      return;
    }

    try {
      const response = await fetch(`/bikes/${bike._id}`, {
        method: "PUT",
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
        toast.error(data.message || "Failed to update bike");
        return;
      }

      toast.success(data.message || "Bike updated successfully");

      onBikeUpdated();
    } catch (error) {
      toast.error("Unable to connect to server");
    }
  };

  return (
    <div className="edit-bike-form">
      <h3>Edit Bike</h3>

      <label>Name</label>

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      <label>Color</label>

      <input
        type="text"
        name="color"
        value={form.color}
        onChange={handleChange}
      />

      <label>Location</label>

      <input
        type="text"
        name="location"
        value={form.location}
        onChange={handleChange}
      />

      <label>Availability</label>

      <select
        name="isAvailable"
        value={form.isAvailable}
        onChange={handleChange}
      >
        <option value={true}>Available</option>

        <option value={false}>Not Available</option>
      </select>

      <div className="bike-card-actions">
        <button onClick={handleSave}>Save</button>

        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditBike;
