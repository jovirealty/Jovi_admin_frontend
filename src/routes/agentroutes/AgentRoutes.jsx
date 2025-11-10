import { Navigate } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
// import Dashboard from "../../pages/Dashboard";
import NotFound from "../../pages/NotFound";
import Placeholder from "../../pages/Placeholder";

import AgentDashboard from "../../pages/dashboard/agent/dashboard/AgentDashboard";
import TipsAndGuides from "../../pages/tipsandguides/agent/TipsAndGuides";
import TipsAndGuidesDetails from "../../pages/tipsandguides/agent/TipsAndGuidesDetails";
import TrainingHub from "../../pages/traininghub/agents/TrainingHub";
import MarketingMaterial from "../../pages/marketingmaterial/MarketingMaterial";
import AgentSupport from "../../pages/support/agent/AgentSupport";
import AgentOrders from "../../pages/orders/agent/AgentOrders";
// import AgentLegalInformation from "../../pages/legalinformation/agent/AgentLegalInformation";
import AgentProfile from "../../pages/profile/agent/AgentProfile";
import NewSupportTicket from "../../pages/support/agent/NewSupportTicket";
import MarketingTemplateDetails from "../../pages/marketingmaterial/MarketingTemplateDetails";


const agentRoutes = {
    path: "/agent",
    element: <ProtectedRoute allow={['agent']} />,
    children: [
        {
            element: <DashboardLayout />,
            children: [
                { index: true, element: <Navigate to="dashboard" replace /> },
                { path: 'dashboard', element: <AgentDashboard /> },
                { path: 'tipsandguides', element: <TipsAndGuides /> },
                { path: 'tipsandguides/:id', element: <TipsAndGuidesDetails /> },
                // { path: 'training-hub', element: <Placeholder title="Training Content" /> },
                { path: 'marketing-material', element: <MarketingMaterial /> },
                { path: 'marketing-material/:id', element: <MarketingTemplateDetails /> },
                { path: 'agent-support', element: <AgentSupport /> },
                { path: 'support/new', element: <NewSupportTicket /> },
                // { path: 'orders', element: <Placeholder element="Orders section" /> },
                // { path: 'legal', element: <AgentLegalInformation /> },
                { path: 'profile', element: <AgentProfile /> },

                { path: 'terms', element: <Placeholder title="Terms legal information" />},
                { path: 'privacy', element: <Placeholder title="Privacylegal information" />},

                // Agent-facing sections (example placeholders)
                // { path: 'customers', element: <Placeholder title="My Customers" /> },
                // { path: 'orders', element: <Placeholder title="My Orders" /> },
                // { path: 'rooms', element: <Placeholder title="Rooms" /> },
                // { path: 'properties', element: <Placeholder title="Property listings" />},

                { path: '*', element: <NotFound /> },
            ],
        },
    ],
};
export default agentRoutes;