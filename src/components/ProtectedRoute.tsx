import { useAtom } from 'jotai';
import React from 'react';
import { Navigate } from 'react-router-dom';

import { authAtom } from '../store';
import Loader from './Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = true }) => {
  const [auth] = useAtom(authAtom);

  // Show loader while checking auth state
  if (auth.token === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // If auth is required and user is not authenticated
  if (requireAuth && !auth.token) {
    return <Navigate to="/" replace />;
  }

  // If auth is not required and user is authenticated (redirect to app)
  if (!requireAuth && auth.token) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
