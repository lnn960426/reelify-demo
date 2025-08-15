import { useState, useEffect } from "react";
import AuthService from '../../services/AuthService';
import styles from "./AdminAccountManagement.module.css";

export default function AdminAccountManagement() {
  // ---------------- User State ----------------
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    role: "user"
  });
  const [users, setUsers] = useState([]);

  // ---------------- Message ----------------
  const [message, setMessage] = useState({ type: "", text: "" });

  // ---------------- Fetch users on mount ----------------
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await AuthService.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ---------------- Handle input changes ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- Add User ----------------
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuthService.register(userForm);
      setMessage({ type: "success", text: "User added successfully!" });
      setTimeout(() => {
        resetForm();
        fetchUsers(); // refresh user list
      }, 2000);
    } catch (error) {
      console.error("Error adding user:", error);
      setMessage({ type: "error", text: "Failed to add user." });
    }
  };

  const resetForm = () => {
    setUserForm({ username: "", email: "", role: "user" });
  };

  // ---------------- Delete User ----------------
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await AuthService.deleteUser(userId);
      setMessage({ type: "success", text: "User deleted successfully!" });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage({ type: "error", text: "Failed to delete user." });
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="container">
      <h1 className={styles.header}>User Account Management</h1>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {/* ---------------- Add User Form ---------------- */}
      <div className={styles.formContainer}>
        <h2>Add New User</h2>
        <form onSubmit={handleUserSubmit} className={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userForm.username}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userForm.email}
            onChange={handleInputChange}
            required
          />
          <select name="role" value={userForm.role} onChange={handleInputChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Add User</button>
          <button type="button" onClick={resetForm}>Reset</button>
        </form>
      </div>

      {/* ---------------- User List ---------------- */}
      <div className={styles.formContainer}>
        <h2>Existing Users</h2>
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user.id}>
              {user.username} ({user.role})
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}