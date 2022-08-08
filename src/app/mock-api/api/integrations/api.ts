import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import {
    data,
    wareHouses,
    erpSelectOptions,
    installationSelectOptions,
    shippingMethods,
} from 'app/mock-api/api/integrations/data';

@Injectable({
    providedIn: 'root',
})
export class IntegrationMockApi {
    private _integrations: any = data;
    private _warehouses: any = wareHouses;
    private _erpSelectOptions: any = erpSelectOptions;
    private _installationSelectOptions: any = installationSelectOptions;
    private _shippingMethods: any = shippingMethods;

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
            .reply(() => [200, cloneDeep(this._integrations)]);

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
    }
}
