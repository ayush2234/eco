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
import { appConfig } from 'app/core/config/app.config';
import { EcommifyApiResponse } from 'app/core/api/api.types';
import { GridUtils } from 'app/layout/common/grid/grid.utils';
import { Company, CompanyListResponse } from './company.types';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  // Private
  private _config = appConfig;
  private _company: BehaviorSubject<Company | null> = new BehaviorSubject(null);
  private _companies: BehaviorSubject<Company[] | null> = new BehaviorSubject(
    null
  );
  private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(
    null
  );
  private _integrationTags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(
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
   * Setter & getter for company
   *
   * @param value
   */
  set company(value: Company) {
    // Store the value
    this._company.next(value);
  }

  get company$(): Observable<Company> {
    return this._company.asObservable();
  }

  /**
   * Getter for companies
   */
  get companies$(): Observable<Company[]> {
    return this._companies.asObservable();
  }

  /**
   * Getter for pagination
   */
  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  /**
   * Getter for company tags
   */
  get integrationTags$(): Observable<Tag[]> {
    return this._integrationTags.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get companies
   *
   *
   * @param page
   * @param size
   * @param sort
   * @param order
   * @param search
   */
  getCompanies(
    page: number = 0,
    size: number = 10,
    sort: string = 'company_name',
    order: 'asc' | 'desc' | '' = 'asc',
    search: string = ''
  ): Observable<EcommifyApiResponse<CompanyListResponse>> {
    const api = this._config?.apiConfig?.baseUrl;

    return this._httpClient
      .get<EcommifyApiResponse<CompanyListResponse>>(`${api}/admin/companies`, {
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
          this._companies.next(result.companies);
        })
      );
  }

  /**
   * Get the current company data
   */
  get(): Observable<Company> {
    return this._httpClient.get<Company>('api/company').pipe(
      tap(company => {
        this._company.next(company);
      })
    );
  }

  /**
   * Get company by id
   */
  getCompanyById(id: string): Observable<Company> {
    return this._companies.pipe(
      take(1),
      map(companies => {
        // Find the company
        const company = companies.find(item => item.company_id === id) || null;

        // Update the company
        this._company.next(company);

        // Return the company
        return company;
      }),
      switchMap(company => {
        if (!company) {
          return throwError('Could not found company with id of ' + id + '!');
        }

        return of(company);
      })
    );
  }

  /**
   * Create company
   */
  createCompany(company: Company): Observable<Company> {
    const api = this._config?.apiConfig?.baseUrl;
    return this.companies$.pipe(
      take(1),
      switchMap(companies =>
        this._httpClient
          .post<EcommifyApiResponse<Company>>(`${api}/admin/company`, company)
          .pipe(
            map(response => {
              const { result: newCompany } = response;

              this._companies.next([newCompany, ...companies]);

              // Return the new company
              return newCompany;
            })
          )
      )
    );
  }

  /**
   * Update company
   *
   * @param id
   * @param company
   */
  updateCompany(id: string, company: Company): Observable<Company> {
    const api = this._config?.apiConfig?.baseUrl;

    return this.companies$.pipe(
      take(1),
      switchMap(companies =>
        this._httpClient
          .put<EcommifyApiResponse<Company>>(
            `${api}/admin/company/${id}`,
            company
          )
          .pipe(
            map(response => {
              const { result: updatedCompany } = response;

              const index = companies.findIndex(item => item.company_id === id);

              // Update the company
              companies[index] = updatedCompany;

              // Update the companies
              this._companies.next(companies);

              // Return the updated company
              return updatedCompany;
            })
          )
      )
    );
  }

  /**
   * Delete the company
   *
   * @param id
   */
  deleteCompany(id: string): Observable<boolean> {
    const api = this._config?.apiConfig?.baseUrl;
    return this.companies$.pipe(
      take(1),
      switchMap(companies =>
        this._httpClient.delete(`${api}/admin/company/${id}`).pipe(
          map((response: EcommifyApiResponse<string>) => {
            const { message } = response;
            const isDeleted = message === 'success';
            // Find the index of the deleted company
            const index = companies.findIndex(item => item.company_id === id);

            // Delete the company
            companies.splice(index, 1);

            // Update the companies
            this._companies.next(companies);

            // Return the deleted status
            return isDeleted;
          })
        )
      )
    );
  }
}
