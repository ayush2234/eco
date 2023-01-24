import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { EcommifyApiResponse } from 'app/core/api/api.types';
import { Pagination } from 'app/layout/common/grid/grid.types';
import { IntegrationListResponse } from 'app/modules/admin/integrations/integration.types';
import { Observable } from 'rxjs';
import { OrderListResponse } from './orders/order.type';
import { SyncLogsService } from './sync-logs.service';
import { SyncLog } from './sync-logs.types';

@Injectable({
  providedIn: 'root',
})
export class SyncLogsResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(private _syncLogsService: SyncLogsService) {}

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
  ): Observable<EcommifyApiResponse<OrderListResponse>> {
    return this._syncLogsService.getSyncLogOrders();
  }
}
@Injectable({
  providedIn: 'root',
})
export class SyncLogsProductsResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(private _syncLogsService: SyncLogsService) {}

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
  ): Observable<{
    pagination: Pagination;
    syncLogs: SyncLog[];
  }> {
    return this._syncLogsService.getSyncLogProducts();
  }
}
@Injectable({
  providedIn: 'root',
})
export class OrdersIntegrationsResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(private _syncLogsService: SyncLogsService) {}

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
    return this._syncLogsService.getIntegrations();
  }
}
