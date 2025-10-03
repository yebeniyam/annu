import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * A component that renders children only if the user is authenticated.
 * If not authenticated, redirects to the login page.
 * Optionally checks for required roles.
 */
const PrivateRoute = ({ roles = [], redirectTo = '/login', children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" mt={2}>Authenticating...</Typography>
      </Box>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required role if roles are specified
  if (roles.length > 0 && !roles.some(role => user?.role === role)) {
    console.warn(`User with role ${user?.role} attempted to access route requiring roles:`, roles);
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