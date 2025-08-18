import { useState, useEffect } from "react";
import AuthService from '../../services/AuthService';
import styles from "./AdminAccountManagement.module.css";

export default function AdminAccountManagement() {
  // User state
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    role: "user"
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);

  // message
  const [message, setMessage] = useState({ type: "", text: "" });

  //fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await AuthService.getAllUsers();
      console.log("Fetched users:", res.data); 
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsersLoading (false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add user
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

  // Delete User
  const handleDeleteUser = async (user_Id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await AuthService.deleteUser(user_Id);
      setMessage({ type: "success", text: "User deleted successfully!" });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage({ type: "error", text: "Failed to delete user." });
    }
  };


  return (
    <div className="container">
      <h1 className={styles.header}>Admin User Account Management</h1>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      
      <div className={styles.formContainer}>
        <h2>Add New User</h2>
        <form onSubmit={handleUserSubmit} className={styles.form}>
                  <label htmlFor="username">Username</label>          
                  <input
            type="text"
            name="username"
            placeholder="Username"
            value={userForm.username}
            onChange={handleInputChange}
            required
          />
     <label htmlFor="email">Email</label>          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userForm.email}
            onChange={handleInputChange}
          
          />
          <select name="role" value={userForm.role} onChange={handleInputChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <>
          <button type="submit">Add User</button>
          <button type="button" onClick={resetForm}>Reset</button>
          </>
        </form>
      </div>

      {/*delete function*/}

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