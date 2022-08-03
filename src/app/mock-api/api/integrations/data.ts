/*
 * GET /api/connections/[tenantid]
 * erps list of installed and available ERPS where product and tracking data is synced back to installed Integration
 * integrations is list of installed (configured and mapped) integrations and available integrations (create new installation) which syncs orders back to ERP.
 */
export const data = {
    erps: {
        installed: [
            {
                erpInstallId: 'df1e061d-b785-4168-ac18-489625071777',
                erpId: 'df1e061d-b785-4168-ac18-489625071777',
                name: 'Maropost Commerce Cloud',
                icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/90431683_10158311076699180_2657409051876392960_n.png',
                description: 'Connect all available integrations to Maropost',
                erpInstallName: 'onesixeightlondon.com.au',
                isInstalled: true,
                isActive: true,
                passConnectionTest: true,
            },
        ],
        available: [
            {
                erpId: 'df1e061d-b785-4168-ac18-489625071777',
                name: 'Shopify',
                icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/57216681_10156066676111881_1843612830612324352_n.jpg',
                description: 'Connect all available integrations to Shopify',
                isInstalled: false,
            },
        ],
    },
    integrations: {
        installed: [
            {
                installationId: 'df1e061d-b785-4168-ac18-489625071b02',
                integrationId: 'c811f373-2053-427e-bc67-3ef7a3337a49',
                erpId: 'df1e061d-b785-4168-ac18-489625071777',
                name: 'WooCommerce',
                icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/90431683_10158311076699180_2657409051876392960_n.png',
                description:
                    'Sync products, inventory, tracking and more to and from WooCommerce',
                installationName: 'onesixeightlondon.com.au',
                isActive: true,
                passConnectionTest: true,
            },
            {
                installationId: 'ca9b1d29-f2d7-4303-aad0-d3ea457649f5',
                integrationId: 'c811f373-2053-427e-bc67-3ef7a3337a49',
                erpId: 'df1e061d-b785-4168-ac18-489625071777',
                name: 'WooCommerce',
                icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/90431683_10158311076699180_2657409051876392960_n.png',
                description:
                    'Sync products, inventory, tracking and more to and from WooCommerce',
                installationName: 'onesixeightlondon.co.nz',
                isActive: true,
                passConnectionTest: true,
            },
            {
                installationId: '869d209b-8a71-46de-bab3-d32df7515d41',
                integrationId: '2afad8bd-7776-41ea-9a99-e7dc345c74ff',
                erpId: 'df1e061d-b785-4168-ac18-489625071777',
                name: 'Custom Integration',
                icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/ecommifyicon-01.svg',
                installationName: '',
                description: 'Syncs Australia Post Data',
                isActive: false,
                passConnectionTest: true,
            },
            {
                installationId: '0eb12ffd-34a8-491a-accc-df9b024f65f7',
                integrationId: '2afad8bd-7776-41ea-9a99-e7dc345c74ff',
                erpId: 'df1e061d-b785-4168-ac18-489625071777',
                name: 'Maropost Commerce Cloud',
                icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/44daee87-399d-45a9-b959-6ea26aedc153-2.png',
                installationName: 'pshomeandliving.co.uk',
                description:
                    'Sync products, inventory, tracking and more to and from Maropost',
                isActive: true,
                passConnectionTest: true,
            },
        ],
        available: [
            {
                integrationId: 'd39c5f3f-26bd-440b-8f99-f95869dfa659',
                erpId: 'df1e061d-b785-4168-ac18-489625071777',
                name: 'Bunnings Marketlink',
                icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/25498408_1747271388901154_6198955593483881874_n.png',
                description:
                    'Sync products, inventory, tracking and more to and from Bunnings Marketlink',
            },
            {
                integrationId: '2afad8bd-7776-41ea-9a99-e7dc345c74ff',
                erpId: 'df1e061d-b785-4168-ac18-489625071777',
                name: 'Maropost Commerce Cloud',
                icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/44daee87-399d-45a9-b959-6ea26aedc153-2.png',
                description:
                    'Sync products, inventory, tracking and more to and from WooCommerce',
            },
            {
                integrationId: '8d4b8e48-3e40-46bf-af09-bb1382270ae8',
                erpId: 'df1e061d-b785-4168-ac18-489625071777',
                name: 'Mosaic Brands',
                icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/mosaic.png',
                description:
                    'Sync products, inventory, tracking and more to and from Maropost',
            },
            {
                integrationId: 'd98519af-0c44-4840-adf8-33a12ab4f2f1',
                erpId: 'df1e061d-b785-4168-ac18-489625071777',
                name: 'Move Inventory Tool',
                icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/ecommifyicon-01.svg',
                description: 'Scan new locations and update Maropost live',
            },
            {
                integrationId: 'c811f373-2053-427e-bc67-3ef7a3337a49',
                erpId: 'df1e061d-b785-4168-ac18-489625071777',
                name: 'WooCommerce',
                icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/90431683_10158311076699180_2657409051876392960_n.png',
                description:
                    'Sync products, inventory, tracking and more to and from WooCommerce',
            },
        ],
    },
};
