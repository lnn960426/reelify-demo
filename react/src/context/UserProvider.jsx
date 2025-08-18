import { useState } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';

export default function UserProvider({ children }) {
  const [user, setUser] = useState(() => getUserAndTokenFromStorage());

  function getUserAndTokenFromStorage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    if (user && token) {
      // Set the token in the axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Set the user to the user state
      return {...user, token, role };
    }

    // If no user/token in local storage, return null to ensure user state variable is assigned null
    return null;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
