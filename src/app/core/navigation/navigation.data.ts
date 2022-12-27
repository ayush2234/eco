import { FuseNavigationItem } from '@fuse/components/navigation';

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
  },
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
        link: '/user/dashboard/integration-status',
      },
      {
        id: 'dashboards.products',
        title: 'Products (coming soon)',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/user/dashboard/products',
      },
    ],
  },
  {
    id: 'sync-logs.products',
    title: 'Products',
    type: 'basic',
    // icon: 'heroicons_outline:shopping-cart',
    link: '/user/sync-logs/products',
  },

  {
    id: 'sync-logs.orders',
    title: 'Orders',
    type: 'basic',
    // icon: 'heroicons_outline:user-group',
    link: '/user/sync-logs/orders',
  },
];


//Master user nav items

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
        // icon: 'heroicons_outline:document-duplicate',
        link: '/user/dashboard/integration-status',
      },
      {
        id: 'dashboards.products',
        title: 'Products (coming soon)',
        type: 'basic',
        // icon: 'heroicons_outline:chart-pie',
        link: '/user/dashboard/products',
      },
    ],
  },
  {
    id: 'sync-logs.products',
    title: 'Products',
    type: 'basic',
    // icon: 'heroicons_outline:shopping-cart',
    link: '/user/sync-logs/products',
  },

  {
    id: 'sync-logs.orders',
    title: 'Orders',
    type: 'basic',
    // icon: 'heroicons_outline:user-group',
    link: '/user/sync-logs/orders',
  },
];
