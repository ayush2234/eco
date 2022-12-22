import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { EcommifyApiResponse } from 'app/core/api/api.types';
import { Observable } from 'rxjs';
import { CompanyService } from '../companies/company.service';
import { CompanyListResponse } from '../companies/company.types';
import { SourceService } from '../sources/source.service';
import { SourceListResponse } from '../sources/source.types';
import { IntegrationService } from './integration.service';
import { IntegrationListResponse } from './integration.types';

@Injectable({
  providedIn: 'root',
})
export class IntegrationResolver implements Resolve<any> {
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
export class IntegrationSourceResolver implements Resolve<any> {
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
export class IntegrationCompanyResolver implements Resolve<any> {
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
