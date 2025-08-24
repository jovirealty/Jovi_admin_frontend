export const NAV = [
  { label: 'Dashboard', to: '/' },
  { label: 'Administrators', to: '/administrators' },
  { label: 'Customers', to: '/customers' },
  { label: 'Categories', to: '/categories' },
  { label: 'Products', to: '/products' },
  { label: 'Orders', to: '/orders' },
  {
    label: 'Matrix',
    children: [
      { label: 'Matrix Users', to: '/matrix/users' },
      { label: 'Matrix Rooms', to: '/matrix/rooms' },
    ],
  },
]
