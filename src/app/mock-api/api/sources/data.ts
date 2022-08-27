export const sources = {
  sources: [
    {
      sourceId: '408ac652-8936-48f3-9e2e-fd20bfb18715',
      name: 'Maropost Commerce Cloud',
      icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/44daee87-399d-45a9-b959-6ea26aedc153-2.png',
      description: 'Connect all available integrations to Maropost',
      isBeta: false,
      isCustom: 'false',
      restrictedToCompanies: [
        '167190fa-51b4-45fc-a742-8ce1b33d24ea',
        '2300ac48-f268-466a-b765-8b878b6e14a7',
      ],
      integration: ['8ec8f60d-552f-4216-9f11-462b95b1d306'],
      connectionForm: 'maropostSource',
      testConnection: true,
      dateCreated: '10/10/2022 11:14 am',
      dateUpdated: '',
      installedInstances: 10,
    },
    {
      sourceId: 'c6b96256-0d21-4571-b1d3-676050dc9f08',
      name: 'Shopify',
      icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/57216681_10156066676111881_1843612830612324352_n.jpg',
      description: 'Connect all available integrations to Maropost',
      isBeta: true,
      isCustom: 'false',
      restrictedToCompanies: [
        '167190fa-51b4-45fc-a742-8ce1b33d24ea',
        '2300ac48-f268-466a-b765-8b878b6e14a7',
      ],
      integration: ['8f868ddb-d4a2-461d-bc3b-d7c8668687c3'],
      testConnection: true,
      connectionForm: 'shopifySource',
      dateCreated: '10/10/2022 11:14 am',
      dateUpdated: '',
      installedInstances: 10,
    },
    {
      sourceId: 'ed78f0de-ad37-4a2f-9836-ed9ea059fb7e',
      name: 'Dear Inventory',
      icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/08/dear.jpg',
      description: 'Connect all available integrations to Dear Inventory',
      isBeta: true,
      isCustom: 'false',
      connectionForm: 'dearSource',
      restrictedToCompanies: [
        '167190fa-51b4-45fc-a742-8ce1b33d24ea',
        '2300ac48-f268-466a-b765-8b878b6e14a7',
      ],
      integration: ['3baea410-a7d6-4916-b79a-bdce50c37f95'],
      testConnection: true,
      dateCreated: '10/10/2022 11:14 am',
      dateUpdated: '',
      installedInstances: 10,
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
