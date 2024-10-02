import { Navigate } from 'react-router-dom';

// Simulated function to check if the user is an admin (get role from localStorage or context)
const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.role || ''; // default to 'user' if no role
};

interface ProtectedRouteProps {
  element: React.ReactNode; // Component to render if authorized
  requiredRoles: string[]; // Role required to access the route
}

// Protects route based on the user's role
const ProtectedRoute = ({ element, requiredRoles }: ProtectedRouteProps) => {
  const userRole = getUserRole();

  // If the user's role doesn't includes the required roles, redirect to login
  if (!requiredRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the component
  return <>{element}</>;
};

export default ProtectedRoute;
