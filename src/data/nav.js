export const NAV = {
  superadmin: [
    { to: '/admin/dashboard', icon: 'home', label: 'Dashboard' },
    { to: '/admin/administrators', icon: 'users', label: 'Administrators' },
    { to: '/admin/property', icon: 'property', label: 'Property' },
    { to: '/admin/resources', icon: 'blog', label: 'Resources' },
    { to: '/admin/customers', icon: 'user-round', label: 'Customers' },
    { label: 'Matrix', icon: 'layers', children: [
        { to: '/admin/matrix/users', label: 'Matrix Users' },
        { to: '/admin/matrix/rooms', label: 'Matrix Rooms' },
      ]
    },
    // …more
  ],
  agent: [
    { to: '/agent/dashboard', icon: 'home', label: 'Dashboard' },
    { to: '/agent/learn', icon: 'book', label: 'Learn' },
    { to: '/agent/properties', icon: 'building', label: 'Properties' },
    { to: '/agent/orders', icon: 'shopping-bag', label: 'Orders' },
    // …more agent items
  ],
};
