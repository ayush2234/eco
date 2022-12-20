import { FuseNavigationItem } from "@fuse/components/navigation";

// super admin nav items

export const superAdminNavigationItems: FuseNavigationItem[] = [
  {
    id: 'admin.dashboards',
    title: 'Dashboards',
    type: 'basic',
    // icon: 'heroicons_outline:user-group',
    link: '/admin/dashboard',
  },

  {
    id: 'admin.companies',
    title: 'Companies',
    type: 'basic',
    // icon: 'heroicons_outline:user-group',
    link: '/admin/companies',
  },
  {
    id: 'admin.users',
    title: 'Users',
    type: 'basic',
    // icon: 'heroicons_outline:user-group',
    link: '/admin/users',
  },
  {
    id: 'admin.integrations',
    title: 'Integrations',
    type: 'basic',
    // icon: 'heroicons_outline:document-duplicate',
    link: '/admin/integrations',
  },
  {
    id: 'admin.sources',
    title: 'Sources',
    type: 'basic',
    // icon: 'heroicons_outline:document-duplicate',
    link: '/admin/sources',
  }

];

//admin nav items

export const adminNavigationItems: FuseNavigationItem[] = [
    {
      id: 'admin.dashboards',
      title: 'Dashboards',
      type: 'basic',
      // icon: 'heroicons_outline:user-group',
      link: '/admin/dashboard',
    },
      {
        id: 'admin.companies',
        title: 'Companies',
        type: 'basic',
        // icon: 'heroicons_outline:user-group',
        link: '/admin/companies',
      },
      {
        id: 'admin.users',
        title: 'Users',
        type: 'basic',
        // icon: 'heroicons_outline:user-group',
        link: '/admin/users',
      },
];

// sub user nav items

export const userNavigationItems: FuseNavigationItem[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    type: 'group',
    children: [
      {
        id: 'dashboards.integration-status',
        title: 'Integration Status',
        type: 'basic',
        icon: 'heroicons_outline:document-duplicate',
        link: '/user/integration-status',
      },
      {
        id: 'dashboards.products',
        title: 'Products (coming soon)',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/user/products',
      },
    ],
  },
      {
        id: 'sync-logs.products',
        title: 'Products',
        type: 'basic',
        // icon: 'heroicons_outline:shopping-cart',
        link: '/sync-logs/products',
      },

      {
        id: 'sync-logs.orders',
        title: 'Orders',
        type: 'basic',
        // icon: 'heroicons_outline:user-group',
        link: '/sync-logs/orders',
      },

  //   ],
  // },
];
export const masterUserNavigationItems: FuseNavigationItem[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    type: 'group',
    children: [
      {
        id: 'dashboards.integration-status',
        title: 'Integration Status',
        type: 'basic',
        icon: 'heroicons_outline:document-duplicate',
        link: '/dashboards/integration-status',
      },
      {
        id: 'dashboards.products',
        title: 'Products (coming soon)',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboards/products',
      },
    ],
  },
  {
    id: 'apps',
    title: 'Apps',
    type: 'group',
    children: [
      {
        id: 'apps.pim',
        title: 'PIM (coming soon)',
        type: 'basic',
        icon: 'heroicons_outline:academic-cap',
        link: '/apps/pim',
      },
    ],
  },
  {
    id: 'sync-logs',
    title: 'Sync Logs',
    type: 'group',
    children: [
      {
        id: 'sync-logs.products',
        title: 'Products',
        type: 'basic',
        icon: 'heroicons_outline:shopping-cart',
        link: '/sync-logs/products',
      },

      {
        id: 'sync-logs.orders',
        title: 'Orders',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/sync-logs/orders',
      },

    ],
  },
];