import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, createBrowserRouter } from 'react-router-dom';

import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/Login';
import Placeholder from '../pages/Placeholder';
import NotFound from '../pages/NotFound';

// roles trees
import adminRoutes from './adminroutes/AdminRoutes';
import agentRoutes from './agentroutes/AgentRoutes';

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
    element: <GuestRoute />,    // users NOT logged in
    children: [{ path: '/login', element: <Login /> }],
  },

  // Authenticated (role-separated)
  adminRoutes,
  agentRoutes,

  // shared utility routes (optional)
  { path: '/403', element: <Placeholder title="Forbidden" /> },
  { path: '/logout', element: <ProtectedRoute allow={[]} />, children: [{ index: true, element: <Logout /> }] },

  // Catch-all outside any layout
  { path: '*', element: <NotFound /> },
]);
