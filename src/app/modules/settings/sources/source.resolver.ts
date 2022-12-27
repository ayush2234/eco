import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';
import { Observable } from 'rxjs';
import { SourceService } from './source.service';
import { SourceSettings } from './source.types';

@Injectable({
  providedIn: 'root',
})
export class SourceResolver implements Resolve<SourceSettings> {
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
  ): Observable<SourceSettings> {
    const companyId = LocalStorageUtils.companyId;
    return this._sourcesService.getSourceSettings(companyId);
  }
}
