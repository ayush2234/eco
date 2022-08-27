import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { ApiResponse } from 'app/core/api/api.types';
import { Pagination, Tag } from 'app/layout/common/grid/grid.types';
import { Observable } from 'rxjs';
import { IntegrationService } from '../integrations/integration.service';
import { IntegrationListResponse } from '../integrations/integration.types';
import { CompanyService } from './company.service';
import { Company, CompanyListResponse } from './company.types';

@Injectable({
  providedIn: 'root',
})
export class CompanyResolver implements Resolve<any> {
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
  ): Observable<ApiResponse<CompanyListResponse>> {
    return this._companyService.getCompanies();
  }
}

@Injectable({
  providedIn: 'root',
})
export class CompanyIntegrationResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(private _integrationService: IntegrationService) {}

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
  ): Observable<ApiResponse<IntegrationListResponse>> {
    return this._integrationService.getIntegrations();
  }
}
