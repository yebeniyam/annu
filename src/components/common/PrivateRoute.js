import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * A component that renders its children without authentication.
 * This is a simplified version that bypasses all auth checks.
 */
const PrivateRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  
  // Mock user with admin role for development
  const mockUser = {
    id: 'test-user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'admin',
    is_active: true,
  };

  // Check if user has required role (if any roles are specified)
  const hasRequiredRole = roles.length === 0 || roles.includes(mockUser.role);
  
  if (!hasRequiredRole) {
    return <div>You don't have permission to access this page.</div>;
  }

  // Always allow access and render children
  return children || <Outlet />;
};

PrivateRoute.propTypes = {
  /**
   * Array of allowed roles. If empty, any user can access.
   */
  roles: PropTypes.arrayOf(PropTypes.string),
  /**
   * Child elements to render.
   */
  children: PropTypes.node,
};

export default PrivateRoute;