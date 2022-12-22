import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Source, SourceInstance, SourceSettings } from './source.types';
import { appConfig } from 'app/core/config/app.config';

import { isEmpty } from 'lodash';
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
}
