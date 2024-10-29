import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthRoute = ({ children }) => {
  const accessToken = Cookies.get('accessToken');

  if (!accessToken) {
    // Redirect to login if access token is not available
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AuthRoute;
