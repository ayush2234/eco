import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
  data,
  wareHouses,
  erpSelectOptions,
  installationSelectOptions,
  shippingMethods,
  integrations as integrationsData,
  companies,
} from 'app/mock-api/api/integrations/data';

@Injectable({
  providedIn: 'root',
})
export class IntegrationMockApi {
  private _connections: any = data;
  private _warehouses: any = wareHouses;
  private _erpSelectOptions: any = erpSelectOptions;
  private _installationSelectOptions: any = installationSelectOptions;
  private _shippingMethods: any = shippingMethods;
  private _integrations: any = integrationsData?.integrations;
  private _companies: any = companies?.companies;

  /**
   * Constructor
   */
  constructor(private _fuseMockApiService: FuseMockApiService) {
    // Register Mock API handlers
    this.registerHandlers();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register Mock API handlers
   */
  registerHandlers(): void {
    // -----------------------------------------------------------------------------------------------------
    // @ Integrations - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/connections/df1e061d-b785-4168-ac18-489625071b02')
      .reply(() => [200, cloneDeep(this._connections)]);

    // -----------------------------------------------------------------------------------------------------
    // @ ErpValueList - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/v1/erpInstallId/warehouses')
      .reply(() => [200, cloneDeep(this._warehouses)]);

    this._fuseMockApiService
      .onGet('api/v1/erpInstallId/shipMethod')
      .reply(() => [200, cloneDeep(this._erpSelectOptions)]);

    this._fuseMockApiService
      .onGet('api/v1/erpInstallId/shippingMethods')
      .reply(() => [200, cloneDeep(this._shippingMethods)]);

    this._fuseMockApiService
      .onGet('api/v1/erpInstallId/pricegroups')
      .reply(() => [200, cloneDeep(this._erpSelectOptions)]);

    this._fuseMockApiService
      .onGet('api/v1/erpInstallId/paymentMethods')
      .reply(() => [200, cloneDeep(this._erpSelectOptions)]);

    this._fuseMockApiService
      .onGet('api/v1/erpInstallId/ShippingServices')
      .reply(() => [200, cloneDeep(this._erpSelectOptions)]);

    this._fuseMockApiService
      .onGet('api/v1/erpInstallId/Carriers')
      .reply(() => [200, cloneDeep(this._erpSelectOptions)]);

    // -----------------------------------------------------------------------------------------------------
    // @ InstallationValueList - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/v1/installationId/shipMethod')
      .reply(() => [200, cloneDeep(this._installationSelectOptions)]);

    this._fuseMockApiService
      .onGet('api/v1/installationId/pricegroups')
      .reply(() => [200, cloneDeep(this._installationSelectOptions)]);

    this._fuseMockApiService
      .onGet('api/v1/installationId/paymentMethods')
      .reply(() => [200, cloneDeep(this._installationSelectOptions)]);

    this._fuseMockApiService
      .onGet('api/v1/installationId/ShippingServices')
      .reply(() => [200, cloneDeep(this._installationSelectOptions)]);

    this._fuseMockApiService
      .onGet('api/v1/installationId/Carriers')
      .reply(() => [200, cloneDeep(this._installationSelectOptions)]);

    // -----------------------------------------------------------------------------------------------------
    // @ integrations - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/integrations', 300)
      .reply(({ request }) => {
        // Get available queries
        const search = request.params.get('search');
        const sort = request.params.get('sort') || 'name';
        const order = request.params.get('order') || 'asc';
        const page = parseInt(request.params.get('page') ?? '1', 10);
        const size = parseInt(request.params.get('size') ?? '10', 10);

        // Clone the integrations
        let integrations: any[] | null = cloneDeep(this._integrations);

        // Sort the integrations
        if (sort === 'id' || sort === 'name' || sort === 'active') {
          integrations.sort((a, b) => {
            const fieldA = a[sort].toString().toUpperCase();
            const fieldB = b[sort].toString().toUpperCase();
            return order === 'asc'
              ? fieldA.localeCompare(fieldB)
              : fieldB.localeCompare(fieldA);
          });
        } else {
          integrations.sort((a, b) =>
            order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
          );
        }

        // If search exists...
        if (search) {
          // Filter the integrations
          integrations = integrations.filter(
            contact =>
              contact.name &&
              contact.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Paginate - Start
        const integrationsLength = integrations.length;

        // Calculate pagination details
        const begin = page * size;
        const end = Math.min(size * (page + 1), integrationsLength);
        const lastPage = Math.max(Math.ceil(integrationsLength / size), 1);

        // Prepare the pagination object
        let pagination = {};

        // If the requested page number is bigger than
        // the last possible page number, return null for
        // integrations but also send the last possible page so
        // the app can navigate to there
        if (page > lastPage) {
          integrations = null;
          pagination = {
            lastPage,
          };
        } else {
          // Paginate the results by size
          integrations = integrations.slice(begin, end);

          // Prepare the pagination mock-api
          pagination = {
            length: integrationsLength,
            size: size,
            page: page,
            lastPage: lastPage,
            startIndex: begin,
            endIndex: end - 1,
          };
        }

        // Return the response
        return [
          200,
          {
            integrations: integrations,
            pagination,
          },
        ];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ integration - POST
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onPost('api/integrations').reply(() => {
      // Generate a new integration
      const newintegration = {
        integrationId: FuseMockApiUtils.guid(),
        name: 'A New Integration',
      };

      // Unshift the new integration
      this._integrations.unshift(newintegration);

      // Return the response
      return [200, newintegration];
    });
    // -----------------------------------------------------------------------------------------------------
    // @ Integration - PATCH
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onPatch('api/integrations')
      .reply(({ request }) => {
        // Get the integration mock-api
        const integration = cloneDeep(request.body.integration);

        // Update the integration mock-api
        this._integrations = assign({}, this._integrations, integration);

        // Return the response
        return [200, cloneDeep(this._integrations)];
      });
  }
}
