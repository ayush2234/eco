import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';
import { Observable } from 'rxjs';
import { SourceService } from './source.service';

@Injectable({
  providedIn: 'root',
})
export class SourceResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(private _sourcesService: SourceService) {}

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
    return this._sourcesService.getSourceSettings(companyId);
  }
}
