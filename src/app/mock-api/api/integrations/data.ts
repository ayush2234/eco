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

export const erpSelectOptions = [
  { option: 'id1', label: 'Erp Option 1' },
  { option: 'id2', label: 'Erp Option 2' },
  { option: 'id3', label: 'Erp Option 3' },
];

export const installationSelectOptions = [
  { option: 'id1', label: 'Installation Option 1' },
  { option: 'id2', label: 'Installation Option 2' },
  { option: 'id3', label: 'Installation Option 3' },
];

export const wareHouses = {
  wareHouse: [
    {
      wareHouseID: '1',
      wareHouseName: 'Ozpig',
    },
    {
      wareHouseID: '2',
      wareHouseName: 'Jagrd',
    },
    {
      wareHouseID: '3',
      wareHouseName: 'Steadfast',
    },
    {
      wareHouseID: '4',
      wareHouseName: 'Isuzu Truck',
    },
    {
      wareHouseID: '5',
      wareHouseName: 'Ford Transit',
    },
    {
      wareHouseID: '6',
      wareHouseName: 'Travelling Stock',
    },
    {
      wareHouseID: '7',
      wareHouseName: 'COFAR',
    },
    {
      wareHouseID: '8',
      wareHouseName: 'Joe Peeters',
    },
    {
      wareHouseID: '9',
      wareHouseName: 'Malcolm Total Logistics',
    },
    {
      wareHouseID: '10',
      wareHouseName: 'Ozpig - Unsaleable Stock',
    },
    {
      wareHouseID: '11',
      wareHouseName: 'Ozpig - Reserved Stock',
    },
    {
      wareHouseID: '12',
      wareHouseName: 'Ozpig Buy Ins',
    },
    {
      wareHouseID: '13',
      wareHouseName: 'SLA',
    },
  ],
  currentTime: '2022-08-08 07:15:55',
  ack: 'Success',
};

export const paymentMethods = {
  currentTime: '2022-08-08 07:34:26',
  ack: 'Success',
  paymentMethods: {
    paymentMethod: [
      {
        accCode: '103',
        visible: 'y',
        name: 'Account Credit',
        active: 'y',
        id: '14',
      },
      {
        accCode: '103',
        visible: 'y',
        name: 'Voucher / Reward Points',
        active: 'y',
        id: '20',
      },
      {
        accCode: '102',
        visible: 'y',
        name: 'PayPal Express',
        active: 'y',
        id: '21',
      },
      {
        accCode: '103',
        visible: 'n',
        name: 'POS Card',
        active: 'y',
        id: '22',
      },
      {
        accCode: '103',
        visible: 'n',
        name: 'POS Cash',
        active: 'y',
        id: '23',
      },
      {
        accCode: '100',
        visible: 'y',
        name: 'Visa',
        active: 'n',
        id: '24',
      },
      {
        accCode: '100',
        visible: 'y',
        name: 'MasterCard',
        active: 'n',
        id: '25',
      },
      {
        accCode: '100',
        visible: 'y',
        name: 'Bank Deposit',
        active: 'y',
        id: '26',
      },
      {
        accCode: '103',
        visible: 'n',
        name: 'Offline Payments',
        active: 'y',
        id: '27',
      },
      {
        accCode: '613',
        visible: 'n',
        name: 'New Zealand - Settlement',
        active: 'y',
        id: '28',
      },
      {
        accCode: '',
        visible: 'n',
        name: 'Amazon AU',
        active: 'y',
        id: '29',
      },
      {
        accCode: '100',
        visible: 'n',
        name: 'Visa',
        active: 'n',
        id: '30',
      },
      {
        accCode: '100',
        visible: 'n',
        name: 'MasterCard',
        active: 'n',
        id: '31',
      },
      {
        accCode: '100',
        visible: 'y',
        name: 'zipPay',
        active: 'y',
        id: '32',
      },
      {
        accCode: '100',
        visible: 'y',
        name: 'zipMoney',
        active: 'y',
        id: '33',
      },
      {
        accCode: '128',
        visible: 'y',
        name: 'Visa',
        active: 'y',
        id: '34',
      },
      {
        accCode: '128',
        visible: 'y',
        name: 'MasterCard',
        active: 'y',
        id: '35',
      },
      {
        accCode: '128',
        visible: 'y',
        name: 'American Express',
        active: 'y',
        id: '36',
      },
      {
        accCode: '129',
        visible: 'n',
        name: 'Shopify Payments',
        active: 'y',
        id: '37',
      },
      {
        accCode: '',
        visible: 'n',
        name: 'eBay Managed Payments',
        active: 'y',
        id: '38',
      },
    ],
  },
};

export const shippingMethods = {
  currentTime: '2022-08-08 07:35:08',
  ack: 'Success',
  shippingMethods: {
    shippingMethod: [
      {
        visibility: {
          ebay: 'true',
          staff: 'true',
          customers: 'true',
        },
        status: 'Active',
        name: 'Road Courier',
        id: '1',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Inactive',
        name: 'Road Courier',
        id: '2',
        description: '',
      },
      {
        visibility: {
          ebay: 'true',
          staff: 'true',
          customers: 'true',
        },
        status: 'Active',
        name: 'Parcel Post - Australia Post eParcel',
        id: '3',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Inactive',
        name: 'Parcel Post - Australia Post eParcel',
        id: '4',
        description: '',
      },
      {
        visibility: {
          ebay: 'true',
          staff: 'true',
          customers: 'true',
        },
        status: 'Active',
        name: 'Express Post - Australia Post eParcel',
        id: '5',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Inactive',
        name: 'Express Post - Australia Post eParcel',
        id: '6',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Active',
        name: 'Pick Up',
        id: '7',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Active',
        name: 'Use my own freight account',
        id: '8',
        description:
          'Please enter your carriers details with your account number below in the delivery instructions box.',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'false',
        },
        status: 'Active',
        name: 'Generic Courier',
        id: '9',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Active',
        name: 'PREMIUM - StarTrack',
        id: '10',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Inactive',
        name: 'ROAD EXPRESS - TNT Express - 4',
        id: '11',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Inactive',
        name: 'ROAD EXPRESS - Toll Express - 4',
        id: '12',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Inactive',
        name: 'ROAD EXPRESS - TNT Express - 5',
        id: '13',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Inactive',
        name: 'ROAD EXPRESS - TNT Express - 6',
        id: '14',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Inactive',
        name: 'ROAD EXPRESS - Toll Express - 5',
        id: '15',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Inactive',
        name: 'ROAD EXPRESS - Toll Express - 6',
        id: '16',
        description: '',
      },
      {
        visibility: {
          ebay: 'true',
          staff: 'true',
          customers: 'true',
        },
        status: 'Active',
        name: 'Long Haul',
        id: '17',
        description: 'Long Haul Ex Auckland',
      },
      {
        visibility: {
          ebay: 'true',
          staff: 'true',
          customers: 'true',
        },
        status: 'Active',
        name: 'Standard shipping',
        id: '18',
        description: 'Delivery Australia Wide',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Inactive',
        name: 'TNT Express',
        id: '19',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Active',
        name: 'TNT - Road Express',
        id: '20',
        description: '',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Active',
        name: 'TNT - Road Express (BP)',
        id: '21',
        description: 'Copy for BP',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'true',
        },
        status: 'Active',
        name: 'TNT - Road Express (BP + mix con)',
        id: '22',
        description: '',
      },
      {
        visibility: {
          ebay: 'true',
          staff: 'true',
          customers: 'true',
        },
        status: 'Active',
        name: 'Free Shipping',
        id: '23',
        description: 'Free Australia Wide Shipping',
      },
      {
        visibility: {
          ebay: 'false',
          staff: 'true',
          customers: 'false',
        },
        status: 'Active',
        name: 'Australia Post - Generic',
        id: '24',
        description: '',
      },
      {
        visibility: {
          ebay: 'true',
          staff: 'true',
          customers: 'true',
        },
        status: 'Active',
        name: 'Electronic Delivery',
        id: '25',
        description: '',
      },
    ],
  },
};

export const integrations = {
  integrations: [
    {
      integrationId: '6a01f17a-cf2f-4b69-80d1-51405d793668',
      sourceId: ['167190fa-51b4-45fc-a742-8ce1b33d24ea'],
      name: 'Maropost Commerce Cloud',
      icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/44daee87-399d-45a9-b959-6ea26aedc153-2.png',
      description:
        'Sync products, inventory, tracking and more to and from WooCommerce',
      restrictedToCompanies: [
        '167190fa-51b4-45fc-a742-8ce1b33d24ea',
        '2300ac48-f268-466a-b765-8b878b6e14a7',
      ],
      isBeta: true,
      isCustom: 'true',
      forceTestConnection: true,
      jsonFormSchemaFile: '',
      dateCreated: '10/10/2022 11:14 am',
      dateUpdated: '',
      installedInstances: 10,
    },
    {
      integrationId: 'fd8e4587-0a83-4d3a-a1f3-c85fb9f8e392',
      sourceId: ['408ac652-8936-48f3-9e2e-fd20bfb18715'],
      name: 'WooCommerce',
      icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/90431683_10158311076699180_2657409051876392960_n.png',
      description:
        'Sync products, inventory, tracking and more to and from WooCommerce',
      restrictedToCompanies: ['f3ce67d4-1320-4b7d-ba9a-a1b6771305c9'],
      isBeta: false,
      isCustom: 'true',
      forceTestConnection: true,
      jsonFormSchemaFile: '',
      dateCreated: '10/10/2022 11:16 am',
      dateUpdated: '10/10/2022 11:18 am',
      installedInstances: 15,
    },
  ],
};

export const companies = {
  companies: [
    {
      companyId: 'f3ce67d4-1320-4b7d-ba9a-a1b6771305c9',
      companyName: 'WolfgroupDev',
      notes: 'TestCompany',
      isActive: true,
      status: 'ok',
      allowBeta: false,
      limits: [
        {
          users: {
            limit: 5,
            used: 0,
          },
        },
        {
          sources: {
            limit: 2,
            used: 0,
          },
        },
        {
          integrations: {
            limit: 1,
            used: 0,
          },
        },
        {
          skus: {
            limit: 20000,
            used: 500,
          },
        },
      ],
    },
    {
      companyId: 'd44a4899-e753-40d0-bc3a-8146990e431c',
      companyName: 'PS Home and Living',
      notes: 'Real Test Company',
      isActive: true,
      status: 'error',
      allowBeta: false,
      limits: [
        {
          users: {
            limit: 10,
            used: 1,
          },
        },
        {
          sources: {
            limit: 10,
            used: 1,
          },
        },
        {
          integrations: {
            limit: 10,
            used: 2,
          },
        },
        {
          skus: {
            limit: 10000,
            used: 500,
          },
        },
      ],
    },
  ],
};
