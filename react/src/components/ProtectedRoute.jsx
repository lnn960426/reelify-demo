import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function ProtectedRoute({ children, roles }) {

  // Get the user from the user context
  const { user } = useContext(UserContext);

  // If there's an authenticated user, continue to child route
  if (!user) {
    return <Navigate to="/login" />;
  }

  if(roles && !roles.includes(user.role)){
    return <Navigate to="/" />;
  }

  // Otherwise, send to login page
  return children;
}
