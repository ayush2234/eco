import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Source, SourceInstance, SourceSettings } from './source.types';
import { appConfig } from 'app/core/config/app.config';
import { ApiResponse } from 'app/core/api/api.types';
import { isEmpty } from 'lodash';

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
      .get<ApiResponse<SourceSettings>>(`${api}/${companyId}/sources`)
      .pipe(
        map(response => {
          const { data } = response;

          if (!isEmpty(data?.sources)) {
            const { sources } = data;
            this._sourceInstances.next(sources[0].instances);
            this._availableSources.next(sources[0].available);

            return data[0];
          }

          return null;
        })
      );
  }
}
