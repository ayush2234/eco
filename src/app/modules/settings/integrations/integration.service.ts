import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import {
  Integration,
  IntegrationInstance,
  IntegrationSettings,
} from './integration.types';
import { appConfig } from 'app/core/config/app.config';
import { ApiResponse } from 'app/core/api/api.types';
import { isEmpty } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class IntegrationService {
  // Private
  private _config = appConfig;
  private _integrationInstances: BehaviorSubject<IntegrationInstance[] | null> =
    new BehaviorSubject(null);
  private _availableIntegrations: BehaviorSubject<Integration[] | null> =
    new BehaviorSubject(null);
  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for installed integration
   */
  get integrationInstances$(): Observable<IntegrationInstance[]> {
    return this._integrationInstances.asObservable();
  }

  /**
   * Getter for available integrations
   */
  get availableIntegrations$(): Observable<Integration[]> {
    return this._availableIntegrations.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get integration settings
   */
  getIntegrationSettings(companyId: string): Observable<IntegrationSettings> {
    const api = this._config.apiConfig.baseUrl;
    return this._httpClient
      .get<ApiResponse<IntegrationSettings[]>>(
        `${api}/${companyId}/integrations`
      )
      .pipe(
        map(response => {
          const { data } = response;

          if (!isEmpty(data)) {
            this._integrationInstances.next(data[0].instances);
            this._availableIntegrations.next(data[0].available);

            return data[0];
          }

          return null;
        })
      );
  }
}
