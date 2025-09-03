import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Loader from './components/ui/Loader';
import ProtectedRoute from './components/ProtectedRoute';

const Home = React.lazy(() => import('./pages/Home'));
const AppPage = React.lazy(() => import('./pages/AppPage'));

const Router: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader size="lg" />
        </div>
      }
    >
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute requireAuth={false}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute requireAuth={true}>
              <AppPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default Router;
