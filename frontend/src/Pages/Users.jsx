import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

const initialForm = {
  email: "",
  password: "",
  role: "user",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Users = () => {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.userRole);

  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(initialForm);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);

  useEffect(() => {
    if (userRole && userRole !== "manager") {
      toast.error("Only managers can access users page");
      navigate("/");
      return;
    }

    if (userRole === "manager") {
      fetchUsers();
    }
  }, [userRole, navigate]);

  const validateUserForm = (form, isEdit = false) => {
    if (!form.email.trim()) {
      return "Email is required";
    }

    if (!emailRegex.test(form.email.trim().toLowerCase())) {
      return "Please enter a valid email";
    }

    if (!isEdit || form.password.trim()) {
      if (form.password.trim().length < 8) {
        return "Password must be at least 8 characters";
      }
    }

    if (!["user", "manager"].includes(form.role)) {
      return "Role must be either user or manager";
    }

    return "";
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/user", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to fetch users");
        setUsers([]);
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      toast.error("Unable to connect to server");
      setUsers([]);
    }
  };

  const handleAddChange = (e) => {
    setAddForm({
      ...addForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    const validationError = validateUserForm(addForm);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const response = await fetch("/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: addForm.email.trim().toLowerCase(),
          password: addForm.password.trim(),
          role: addForm.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to create user");
        return;
      }

      toast.success(data.message || "User created successfully");
      setAddForm(initialForm);
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      toast.error("Unable to connect to server");
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditForm({
      email: user.email || "",
      password: "",
      role: user.role || "user",
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditForm(initialForm);
  };

  const handleUpdateUser = async (userId) => {
    const validationError = validateUserForm(editForm, true);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload = {
      email: editForm.email.trim().toLowerCase(),
      role: editForm.role,
    };

    if (editForm.password.trim()) {
      payload.password = editForm.password.trim();
    }

    try {
      const response = await fetch(`/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to update user");
        return;
      }

      toast.success(data.message || "User updated successfully");
      setEditingUserId(null);
      setEditForm(initialForm);
      fetchUsers();
    } catch (error) {
      toast.error("Unable to connect to server");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/user/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to delete user");
        return;
      }

      toast.success(data.message || "User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Unable to connect to server");
    }
  };

  const handleViewReservations = (userId) => {
    navigate(`/reservation?userId=${userId}`);
  };

  if (userRole !== "manager") {
    return null;
  }

  return (
    <>
      <Navbar isLoggedIn={true} />

      <div className="reservation-page">
        <h2>Users</h2>

        {!showAddForm ? (
          <button
            className="add-bike-button"
            onClick={() => setShowAddForm(true)}
          >
            Add User
          </button>
        ) : (
          <div className="add-bike-form" style={{ marginBottom: "20px" }}>
            <h3>Add User</h3>

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={addForm.email}
              onChange={handleAddChange}
              placeholder="Enter email"
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={addForm.password}
              onChange={handleAddChange}
              placeholder="Enter password"
            />

            <label>Role</label>
            <select name="role" value={addForm.role} onChange={handleAddChange}>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>

            <div className="bike-card-actions">
              <button onClick={handleAddUser}>Create</button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setAddForm(initialForm);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="bike-list">
            {users.map((user) => (
              <div className="bike-card" key={user._id}>
                {editingUserId === user._id ? (
                  <>
                    <h3>Edit User</h3>

                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                    />

                    <label>New Password</label>
                    <input
                      type="password"
                      name="password"
                      value={editForm.password}
                      onChange={handleEditChange}
                      placeholder="Leave blank to keep current password"
                    />

                    <label>Role</label>
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={handleEditChange}
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                    </select>

                    <div className="bike-card-actions">
                      <button onClick={() => handleUpdateUser(user._id)}>
                        Save
                      </button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>{user.email}</h3>

                    <p>
                      <strong>Role:</strong> {user.role}
                    </p>

                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>

                    <div className="bike-card-actions">
                      <button onClick={() => handleEditClick(user)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteUser(user._id)}>
                        Delete
                      </button>
                      <button onClick={() => handleViewReservations(user._id)}>
                        See Reservations
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
