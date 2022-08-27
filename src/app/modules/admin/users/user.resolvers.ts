import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Pagination, Tag } from 'app/layout/common/grid/grid.types';
import { catchError, Observable, throwError } from 'rxjs';

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
  ): Observable<{
    pagination: Pagination;
    users: User[];
  }> {
    return this._userService.getUsers();
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserTagResolver implements Resolve<any> {
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
  ): Observable<Tag[]> {
    return this._userService.getTags();
  }
}
