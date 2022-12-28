/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { Pagination, Tag } from 'app/layout/common/grid/grid.types';
import { Source, SourceListResponse } from './source.types';
import { appConfig } from 'app/core/config/app.config';
import { EcommifyApiResponse } from 'app/core/api/api.types';
import { GridUtils } from 'app/layout/common/grid/grid.utils';

@Injectable({
  providedIn: 'root',
})
export class SourceService {
  // Private
  private _config = appConfig;
  private _source: BehaviorSubject<Source | null> = new BehaviorSubject(null);
  private _sources: BehaviorSubject<Source[] | null> = new BehaviorSubject(
    null
  );
  private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(
    null
  );

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for source
   *
   * @param value
   */
  set source(value: Source) {
    // Store the value
    this._source.next(value);
  }

  get source$(): Observable<Source> {
    return this._source.asObservable();
  }

  /**
   * Getter for sources
   */
  get sources$(): Observable<Source[]> {
    return this._sources.asObservable();
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
   * Get sources
   *
   *
   * @param page
   * @param size
   * @param sort
   * @param order
   * @param search
   */
  getSources(
    page: number = 0,
    size: number = 10,
    sort: string = 'name',
    order: 'asc' | 'desc' | '' = 'asc',
    search: string = ''
  ): Observable<EcommifyApiResponse<SourceListResponse>> {
    const api = this._config?.apiConfig?.baseUrl;
    return this._httpClient
      .get<EcommifyApiResponse<SourceListResponse>>(`${api}/admin/sources`, {
        params: {
          page: '' + page,
          size: '' + size,
          sort,
          order,
          search,
        },
      })
      .pipe(
        tap(response => {
          const { result } = response;
          const pagination = GridUtils.getPagination(result);
          this._pagination.next(pagination);
          this._sources.next(result?.sources);
        })
      );
  }

  /**
   * Get the current source data
   */
  get(): Observable<Source> {
    const api = this._config?.apiConfig?.baseUrl;
    return this._httpClient.get<Source>('api/source').pipe(
      tap(source => {
        this._source.next(source);
      })
    );
  }

  /**
   * Get source by id
   */
  getSourceById(id: string): Observable<Source> {
    return this._sources.pipe(
      take(1),
      map(sources => {
        // Find the source
        const source = sources.find(item => item.source_id === id) || null;

        // Update the source
        this._source.next(source);

        // Return the source
        return source;
      }),
      switchMap(source => {
        if (!source) {
          return throwError('Could not found source with id of ' + id + '!');
        }

        return of(source);
      })
    );
  }

  /**
   * Create source
   */
  createSource(source: Source): Observable<Source> {
    const api = this._config?.apiConfig?.baseUrl;
    return this.sources$.pipe(
      take(1),
      switchMap(sources =>
        this._httpClient
          .post<EcommifyApiResponse<Source>>(`${api}/admin/source`, source)
          .pipe(
            map(response => {
              const { result: newSource } = response;
              // Update the sources with the new source
              this._sources.next([newSource['source'], ...sources]);

              // Return the new source
              return newSource;
            })
          )
      )
    );
  }

  /**
   * Update source
   *
   * @param id
   * @param source
   */
  updateSource(id: string, source: Source): Observable<Source> {
    const api = this._config?.apiConfig?.baseUrl;
    return this.sources$.pipe(
      take(1),
      switchMap(sources =>
        this._httpClient
          .put<EcommifyApiResponse<Source>>(`${api}/admin/source/${id}`, source)
          .pipe(
            map(response => {
              const { result: updatedSource } = response;
              // Find the index of the updated source
              const index = sources.findIndex(item => item.source_id === id);

              // Update the source
              sources[index] = updatedSource;

              // Update the sources
              this._sources.next(sources);

              // Return the updated source
              return updatedSource;
            })
          )
      )
    );
  }

  /**
   * Delete the source
   *
   * @param id
   */
  deleteSource(id: string): Observable<boolean> {
    const api = this._config?.apiConfig?.baseUrl;
    return this.sources$.pipe(
      take(1),
      switchMap(sources =>
        this._httpClient.delete(`${api}/admin/source/${id}`).pipe(
          map((response: EcommifyApiResponse<string>) => {
            const { message } = response;
            const isDeleted = message === 'success';
            // Find the index of the deleted source
            const index = sources.findIndex(item => item.source_id === id);

            // Delete the source
            sources.splice(index, 1);

            // Update the sources
            this._sources.next(sources);

            // Return the deleted status
            return isDeleted;
          })
        )
      )
    );
  }
}
