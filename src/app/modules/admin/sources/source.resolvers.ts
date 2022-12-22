import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { EcommifyApiResponse } from 'app/core/api/api.types';
import { Tag } from 'app/layout/common/grid/grid.types';
import { Observable } from 'rxjs';
import { CompanyService } from '../companies/company.service';
import { CompanyListResponse } from '../companies/company.types';
import { SourceService } from './source.service';
import { SourceListResponse } from './source.types';

@Injectable({
  providedIn: 'root',
})
export class SourceResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(private _sourceService: SourceService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   * @param route
   * @param state
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<EcommifyApiResponse<SourceListResponse>> {
    return this._sourceService.getSources();
  }
}

@Injectable({
  providedIn: 'root',
})
export class SourceCompanyResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(private _companyService: CompanyService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   * @param route
   * @param state
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<EcommifyApiResponse<CompanyListResponse>> {
    return this._companyService.getCompanies();
  }
}
