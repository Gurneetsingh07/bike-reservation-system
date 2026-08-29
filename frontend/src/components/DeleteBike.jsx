import React from "react";
import { toast } from "react-toastify";

const DeleteBike = ({ bikeId, onBikeDeleted }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bike?",
    );

    if (!confirmDelete) {
      return;
    }

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

      toast.success(data.message || "Bike deleted successfully");

      onBikeDeleted();
    } catch (error) {
      toast.error("Unable to connect to server");
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
};

export default DeleteBike;
