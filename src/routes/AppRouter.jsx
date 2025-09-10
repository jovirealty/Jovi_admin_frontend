import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import Placeholder from '../pages/Placeholder';
import Login from '../pages/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    logout().finally(() => navigate('/login', { replace: true }));
  }, []);
  return null;
}

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <Login /> },
    ]
  },
  // Authenticated roles
  {
    element: <ProtectedRoute allow={['superadmin']} />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'administrators', element: <Placeholder title="Administrators" /> },
          { path: 'customers', element: <Placeholder title="Customers" /> },
          { path: 'categories', element: <Placeholder title="Categories" /> },
          { path: 'products', element: <Placeholder title="Products" /> },
          { path: 'orders', element: <Placeholder title="Orders" /> },
          { path: 'matrix', element: <Placeholder title="Matrix" /> },
          { path: 'matrix/users', element: <Placeholder title="Matrix Users" /> },
          { path: 'matrix/rooms', element: <Placeholder title="Matrix Rooms" /> },

          { path: 'logout', element: <Logout /> },                        // ← logout route
          { path: '403', element: <Placeholder title="Forbidden" /> },    // ← target for 403
          { path: '*', element: <NotFound /> },
        ],
      }
    ]
  },
])
