import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';
import {
  Source,
  SourceInstance,
  SourcePayload,
  SourceSettings,
} from './source.types';
import { appConfig } from 'app/core/config/app.config';

import { isEmpty } from 'lodash';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';
import { EcommifyApiResponse } from 'app/core/api/api.types';

@Injectable({
  providedIn: 'root',
})
export class SourceService {
  // Private
  private _config = appConfig;
  private _sourceInstances: BehaviorSubject<SourceInstance[] | null> =
    new BehaviorSubject(null);
  private _availableSources: BehaviorSubject<Source[] | null> =
    new BehaviorSubject(null);
  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for installed source
   */
  get sourceInstances$(): Observable<SourceInstance[]> {
    return this._sourceInstances.asObservable();
  }

  /**
   * Getter for available sources
   */
  get availableSources$(): Observable<Source[]> {
    return this._availableSources.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get source settings
   */
  getSourceSettings(companyId: string): Observable<SourceSettings> {
    const api = this._config.apiConfig.baseUrl;
    return this._httpClient
      .get<EcommifyApiResponse<SourceSettings>>(`${api}/${companyId}/sources`)
      .pipe(
        map(response => {
          const { result } = response;

          if (!isEmpty(result?.sources)) {
            const { sources } = result;
            this._sourceInstances.next(sources[0].instances);
            this._availableSources.next(sources[0].available);

            return result[0];
          }

          return null;
        })
      );
  }

  /**
   * View source instance
   */
  getSourceInstance(
    companyId: string,
    instanceId: string
  ): Observable<SourcePayload> {
    const api = this._config.apiConfig.baseUrl;
    return this._httpClient
      .get<EcommifyApiResponse<SourcePayload>>(
        `${api}/${companyId}/source/instance/${instanceId}`
      )
      .pipe(
        map(response => {
          if (!isEmpty(response['result'])) {
            return response['result'];
          }
          return null;
        })
      );
  }

  /**
   * Create source instance api
   */
  createSourceInstance(
    companyId: string,
    payload: SourcePayload
  ): Observable<SourcePayload> {
    const api = this._config.apiConfig.baseUrl;
    return this._httpClient
      .post<EcommifyApiResponse<SourcePayload>>(
        `${api}/${companyId}/source/instance`,
        payload
      )
      .pipe(
        map(response => {
          const { result } = response;
          this.updateSources();
          return result;
        })
      );
  }

  /**
   * Update source instance api
   */
  updateSourceInstance(
    companyId: string,
    payload: SourcePayload,
    instanceId: string
  ): Observable<SourcePayload> {
    const api = this._config.apiConfig.baseUrl;
    return this.sourceInstances$.pipe(
      take(1),
      switchMap(sources =>
        this._httpClient
          .put<EcommifyApiResponse<SourcePayload>>(
            `${api}/${companyId}/source/instance/${instanceId}`,
            payload
          )
          .pipe(
            map(response => {
              if (!isEmpty(response['result'])) {
                this.updateSources();
                return response['result'];
              }
              return null;
            })
          )
      )
    );
  }

  /**
   * Get Marapost O-Auth api
   */
  getMarapostOauthUrl(
    companyId: string,
    store_domain: string
  ): Observable<any> {
    const api = this._config.apiConfig.serviceUrl;
    return this._httpClient
      .post<EcommifyApiResponse<any>>(`${api}/oauth/maropost/${companyId}`, {
        store_domain,
      })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /**
   * Update Sources list in UI
   */
  updateSources(): void {
    this.getSourceSettings(LocalStorageUtils.companyId).subscribe();
  }
}
