import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';
import { Observable } from 'rxjs';
import { IntegrationService } from './integration.service';

@Injectable({
  providedIn: 'root',
})
export class IntegrationResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(private _integrationsService: IntegrationService) {}

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
  ): Observable<any> {
    const companyId = LocalStorageUtils.companyId;
    return this._integrationsService.getIntegrationSettings(companyId);
  }
}
