/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { Pagination, Tag } from 'app/layout/common/grid/grid.types';
import { Integration, IntegrationListResponse } from './integration.types';
import { appConfig } from 'app/core/config/app.config';
import { EcommifyApiResponse } from 'app/core/api/api.types';
import { GridUtils } from 'app/layout/common/grid/grid.utils';

@Injectable({
  providedIn: 'root',
})
export class IntegrationService {
  // Private
  private _config = appConfig;
  private _integration: BehaviorSubject<Integration | null> =
    new BehaviorSubject(null);
  private _integrations: BehaviorSubject<Integration[] | null> =
    new BehaviorSubject(null);
  private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(
    null
  );
  private _sourceTags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(
    null
  );
  private _restrictedToCompanyTags: BehaviorSubject<Tag[] | null> =
    new BehaviorSubject(null);

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for integration
   *
   * @param value
   */
  set integration(value: Integration) {
    // Store the value
    this._integration.next(value);
  }

  get integration$(): Observable<Integration> {
    return this._integration.asObservable();
  }

  /**
   * Getter for integrations
   */
  get integrations$(): Observable<Integration[]> {
    return this._integrations.asObservable();
  }

  /**
   * Getter for pagination
   */
  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get integrations
   *
   *
   * @param page
   * @param size
   * @param sort
   * @param order
   * @param search
   */
  getIntegrations(
    page: number = 0,
    size: number = 10,
    sort: string = 'name',
    order: 'asc' | 'desc' | '' = 'asc',
    search: string = ''
  ): Observable<EcommifyApiResponse<IntegrationListResponse>> {
    const api = this._config?.apiConfig?.baseUrl;

    return this._httpClient
      .get<EcommifyApiResponse<IntegrationListResponse>>(
        `${api}/admin/integrations`,
        {
          params: {
            page: '' + page,
            size: '' + size,
            sort,
            order,
            search,
          },
        }
      )
      .pipe(
        tap(response => {
          const { result } = response;
          const pagination = GridUtils.getPagination(result);
          this._pagination.next(pagination);
          this._integrations.next(result?.integrations);
        })
      );
  }

  /**
   * Get the current integration data
   */
  get(): Observable<Integration> {
    return this._httpClient.get<Integration>('api/integration').pipe(
      tap(integration => {
        this._integration.next(integration);
      })
    );
  }

  /**
   * Get integration by id
   */
  getIntegrationById(id: string): Observable<Integration> {
    return this._integrations.pipe(
      take(1),
      map(integrations => {
        // Find the integration
        const integration =
          integrations.find(item => item.integration_id === id) || null;

        // Update the integration
        this._integration.next(integration);

        // Return the integration
        return integration;
      }),
      switchMap(integration => {
        if (!integration) {
          return throwError(
            'Could not found integration with id of ' + id + '!'
          );
        }

        return of(integration);
      })
    );
  }

  /**
   * Create integration
   */
  createIntegration(integration: Integration): Observable<Integration> {
    const api = this._config?.apiConfig?.baseUrl;
    return this.integrations$.pipe(
      take(1),
      switchMap(integrations =>
        this._httpClient
          .post<EcommifyApiResponse<Integration>>(
            `${api}/admin/integration`,
            integration
          )
          .pipe(
            map(response => {
              const { result: newIntegration } = response;
              // Update the integrations with the new integration
              this._integrations.next([newIntegration, ...integrations]);

              // Return the new integration
              return newIntegration;
            })
          )
      )
    );
  }

  /**
   * Update integration
   *
   * @param id
   * @param integration
   */
  updateIntegration(
    id: string,
    integration: Integration
  ): Observable<Integration> {
    const api = this._config?.apiConfig?.baseUrl;

    return this.integrations$.pipe(
      take(1),
      switchMap(integrations =>
        this._httpClient
          .put<EcommifyApiResponse<Integration>>(
            `${api}/admin/integration/${id}`,
            integration
          )
          .pipe(
            map(response => {
              const { result: updatedIntegration } = response;
              // Find the index of the updated integration
              const index = integrations.findIndex(
                item => item.integration_id === id
              );

              // Update the integration
              integrations[index] = updatedIntegration;

              // Update the integrations
              this._integrations.next(integrations);

              // Return the updated integration
              return updatedIntegration;
            })
          )
      )
    );
  }

  /**
   * Delete the integration
   *
   * @param id
   */
  deleteIntegration(id: string): Observable<boolean> {
    const api = this._config?.apiConfig?.baseUrl;

    return this.integrations$.pipe(
      take(1),
      switchMap(integrations =>
        this._httpClient.delete(`${api}/admin/integration/${id}`).pipe(
          map((response: EcommifyApiResponse<string>) => {
            const { message } = response;
            const isDeleted = message === 'success';

            if (isDeleted) {
              // Find the index of the deleted integration
              const index = integrations.findIndex(
                item => item.integration_id === id
              );

              // Delete the integration
              integrations.splice(index, 1);

              // Update the integrations
              this._integrations.next(integrations);
            }

            // Return the deleted status
            return isDeleted;
          })
        )
      )
    );
  }
}
