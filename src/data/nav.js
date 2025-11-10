export const NAV = {
  superadmin: [
    { to: '/admin/dashboard', icon: 'home', label: 'Dashboard' },
    { to: '/admin/administrators', icon: 'users', label: 'Administrators' },
    { to: '/admin/property', icon: 'property', label: 'Property' },
    { to: '/admin/resources', icon: 'blog', label: 'Resources' },
    { to: '/admin/inquiry', icon: 'inquiry', label: 'Inquiry' },
    // // { to: '/admin/customers', icon: 'user-round', label: 'Customers' },
    // { label: 'Matrix', icon: 'layers', children: [
    //     { to: '/admin/matrix/users', label: 'Matrix Users' },
    //     { to: '/admin/matrix/rooms', label: 'Matrix Rooms' },
    //   ]
    // },
    // …more
  ],
  agent: [
    { to: '/agent/dashboard',           icon: 'home',       label: 'Dashboard'          },
    { to: '/agent/tipsandguides',       icon: '',           label: 'Tips & Guides'      },
    // { to: '/agent/training-hub',        icon: 'learn',      label: 'Training Hub'       },
    { to: '/agent/marketing-material',  icon: 'marketing',  label: 'Marketing Material' },
    { to: '/agent/agent-support',       icon: 'support',    label: 'Agent Support'      },
    // { to: '/agent/orders',              icon: 'order',      label: 'Orders'             },
  ],
};
