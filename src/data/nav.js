export const NAV = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Administrators', to: '/admin/administrators' },
  { label: 'Customers', to: '/admin/customers' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Orders', to: '/admin/orders' },
  {
    label: 'Matrix',
    children: [
      { label: 'Matrix Users', to: '/admin/matrix/users' },
      { label: 'Matrix Rooms', to: '/admin/matrix/rooms' },
    ],
  },
];