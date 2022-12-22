import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { EcommifyApiResponse } from 'app/core/api/api.types';
import { UserService } from 'app/core/user/user.service';
import { User, UserListResponse } from 'app/core/user/user.types';
import { Pagination, Tag } from 'app/layout/common/grid/grid.types';
import { catchError, Observable, throwError } from 'rxjs';
import { CompanyService } from '../companies/company.service';
import { CompanyListResponse } from '../companies/company.types';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(private _userService: UserService) {}

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
  ): Observable<EcommifyApiResponse<UserListResponse>> {
    return this._userService.getUsers();
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserCompanyResolver implements Resolve<any> {
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
