import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { integrations as integrationsData } from 'app/mock-api/settings/integrations/data';

@Injectable({
    providedIn: 'root',
})
export class IntegrationMockApi {
    private _integrations: any = integrationsData;

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
            .onGet('api/integrations/installed')
            .reply(() => [200, cloneDeep(this._integrations?.installed)]);

        // -----------------------------------------------------------------------------------------------------
        // @ Integrations - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/integrations/available')
            .reply(() => [200, cloneDeep(this._integrations?.available)]);

        // -----------------------------------------------------------------------------------------------------
        // @ Integrations - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/integrations/source-channel')
            .reply(() => [200, cloneDeep(this._integrations?.sourceChannel)]);
    }
}
