import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { EcommifyApiResponse } from 'app/core/api/api.types';
import { Pagination, Tag } from 'app/layout/common/grid/grid.types';
import { Observable } from 'rxjs';
import { IntegrationService } from '../integrations/integration.service';
import { IntegrationListResponse } from '../integrations/integration.types';
import { SourceService } from '../sources/source.service';
import { SourceListResponse } from '../sources/source.types';
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
  ): Observable<EcommifyApiResponse<CompanyListResponse>> {
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
  ): Observable<EcommifyApiResponse<IntegrationListResponse>> {
    return this._integrationService.getIntegrations();
  }
}

@Injectable({
  providedIn: 'root',
})
export class CompanySourceResolver implements Resolve<any> {
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
