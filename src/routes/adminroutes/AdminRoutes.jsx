import { Navigate } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

// Pages
import DashboardLayout from "../../layouts/DashboardLayout";
import Dashboard from "../../pages/dashboard/admin/Dashboard";
import NotFound from "../../pages/NotFound";
import Placeholder from "../../pages/Placeholder";
import PropertyList from "../../pages/properties/PropertyList";
import AddProperty from "../../pages/properties/AddProperty";
import ResourceList from "../../pages/resources/ResourceList";

import AdministratorsList from "../../pages/administrators/AdministratorsList";
import CreateAdministrator from "../../pages/administrators/CreateAdministrator";
import EditAdministrator from "../../pages/administrators/EditAdministrator";
import AdministratorShowDrawer from "../../pages/administrators/AdministratorShowDrawer";
import ResourceAdd from "../../pages/resources/ResourceAdd";
import ResourceEdit from "../../pages/resources/ResourceEdit";
import DisplayProperty from "../../pages/properties/DisplayProperty";

const adminRoutes = {
    path: "/admin",
    element: <ProtectedRoute allow={['superadmin']} />,
    children: [
        {
            element: <DashboardLayout />, 
            children: [
                { index: true, element: <Navigate to="dashboard" replace /> },
                { path: "dashboard", element: <Dashboard /> }, // Dashboard screens
                // Adminstrator routes
                {
                    path: 'administrators',
                    element: <AdministratorsList />,
                    children: [
                        { path: ':id/show', element: <AdministratorShowDrawer /> },
                    ],
                },
                { path: 'administrators/:id/edit', element: <EditAdministrator /> },
                { path: 'administrators/newadministrators', element: <CreateAdministrator /> },
                // Adminstrator routes-----------------ends

                // Property listing routes
                { path: 'property', element: <PropertyList /> },
                { path: 'property/add-property', element: <AddProperty />},
                { path: 'property/property-detail/:id', element: <DisplayProperty />  },

                // Resource routes
                { path: 'resources', element: <ResourceList /> },
                { path: 'resources/new', element: <ResourceAdd /> },
                { path: 'resources/edit/:id', element: <ResourceEdit /> },
                // Your other areas (stubs for now)
                // { path: 'customers', element: <Placeholder title="Customers" /> },
                { path: 'categories', element: <Placeholder title="Categories" /> },
                { path: 'products', element: <Placeholder title="Products" /> },
                // { path: 'orders', element: <Placeholder title="Orders" /> },
                // { path: 'matrix', element: <Placeholder title="Matrix" /> },
                // { path: 'matrix/users', element: <Placeholder title="Matrix Users" /> },
                // { path: 'matrix/rooms', element: <Placeholder title="Matrix Rooms" /> },

                { path: '/admin/*', element: <NotFound /> },
            ],
        }
    ],
};

export default adminRoutes;