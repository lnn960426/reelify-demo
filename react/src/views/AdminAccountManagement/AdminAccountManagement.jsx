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
      setUsersLoading(false);
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
      <div className={styles.header}>
        <h1>User Management Panel</h1>
        <p>Deleting the User from the database</p>
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {/*delete function*/}

      <div className={styles.formContainer}>
        <ul className={styles.userList}>

          <li className={styles.userListHeader}>
            <div>
              <span> USER LIST</span>
            </div>
            <div>
            </div>

          </li>

          {users.map((user) => (
            <li key={user.id}>
              <div>
                <span className={styles.username}> {user.username}</span>
              </div>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}