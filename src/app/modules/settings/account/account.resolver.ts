import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingAccountResolver implements Resolve<any> {
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
  ): Observable<any> {
    return this._userService
      .getUsers()
      .pipe(
        switchMap(users =>
          this._userService.getUserById('cfaad35d-07a3-4447-a6c3-d8c3d54fd5df')
        )
      );
  }
}
