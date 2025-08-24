import { createBrowserRouter } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Dashboard from '../pages/Dashboard'
import Placeholder from '../pages/Placeholder'

export const router = createBrowserRouter([
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
    ],
  },
])
