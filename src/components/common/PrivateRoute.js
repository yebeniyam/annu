import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

/**
 * A component that renders children only if the user is authenticated.
 * If not authenticated, redirects to the login page.
 * Optionally checks for required roles.
 */
const PrivateRoute = ({ roles = [], redirectTo = '/login', children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required role if roles are specified
  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Redirect to unauthorized or home if user doesn't have required role
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // If authenticated and has required role, render children or outlet
  return children || <Outlet />;
};

PrivateRoute.propTypes = {
  /**
   * Array of allowed roles. If empty, any authenticated user can access.
   */
  roles: PropTypes.arrayOf(PropTypes.string),
  /**
   * Path to redirect to if not authenticated.
   */
  redirectTo: PropTypes.string,
  /**
   * Child elements to render if authenticated.
   */
  children: PropTypes.node,
};

export default PrivateRoute;