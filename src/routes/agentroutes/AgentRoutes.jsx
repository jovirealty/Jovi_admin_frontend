import { Navigate } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
import Dashboard from "../../pages/Dashboard";
import NotFound from "../../pages/NotFound";
import Placeholder from "../../pages/Placeholder";

const agentRoutes = {
    path: "/agent",
    element: <ProtectedRoute allow={['agent']} />,
    children: [
        {
            element: <DashboardLayout />,
            children: [
                { index: true, element: <Navigate to="dashboard" replace /> },
                { path: 'dashboard', element: <Placeholder title="Agent dashboard" /> },

                // Agent-facing sections (example placeholders)
                { path: 'customers', element: <Placeholder title="My Customers" /> },
                { path: 'orders', element: <Placeholder title="My Orders" /> },
                { path: 'rooms', element: <Placeholder title="Rooms" /> },
                { path: 'properties', element: <Placeholder title="Property listings" />},

                { path: '/agent/*', element: <NotFound /> },
            ],
        },
    ],
};
export default agentRoutes;