/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
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
        id: 'sync-logs.inventory',
        title: 'Inventory',
        type: 'basic',
        icon: 'heroicons_outline:chat-alt',
        link: '/sync-logs/inventory',
      },
      {
        id: 'sync-logs.orders',
        title: 'Orders',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/sync-logs/orders',
      },
      {
        id: 'sync-logs.tracking',
        title: 'Tracking',
        type: 'basic',
        icon: 'heroicons_outline:cloud',
        link: '/sync-logs/tracking',
      },
    ],
  },
  {
    id: 'admin',
    title: 'Admin',
    type: 'group',
    children: [
      {
        id: 'admin.companies',
        title: 'Companies',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/companies',
      },
      {
        id: 'admin.users',
        title: 'Users',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/users',
      },
      {
        id: 'admin.integrations',
        title: 'Integrations',
        type: 'basic',
        icon: 'heroicons_outline:document-duplicate',
        link: '/integrations',
      },
      {
        id: 'admin.sources',
        title: 'Sources',
        type: 'basic',
        icon: 'heroicons_outline:document-duplicate',
        link: '/sources',
      },
    ],
  },
];
export const compactNavigation: FuseNavigationItem[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    type: 'group',
  },
  {
    id: 'apps',
    title: 'Apps',
    type: 'group',
  },
  {
    id: 'sync-logs',
    title: 'Sync Logs',
    type: 'group',
  },
  {
    id: 'admin',
    title: 'Admin',
    type: 'group',
  },
];
export const futuristicNavigation: FuseNavigationItem[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    type: 'group',
  },
  {
    id: 'apps',
    title: 'Apps',
    type: 'group',
  },
  {
    id: 'sync-logs',
    title: 'Sync Logs',
    type: 'group',
  },
  {
    id: 'admin',
    title: 'Admin',
    type: 'group',
  },
];
export const horizontalNavigation: FuseNavigationItem[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    type: 'group',
  },
  {
    id: 'apps',
    title: 'Apps',
    type: 'group',
  },
  {
    id: 'sync-logs',
    title: 'Sync Logs',
    type: 'group',
  },
  {
    id: 'admin',
    title: 'Admin',
    type: 'group',
  },
];
