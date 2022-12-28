import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { UserService } from 'app/core/user/user.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const url = state.url;

    if (this.authService.companies && this.authService.companies.length > 0) {
      if (this.authService.role !== 'user' || 'masterUser') {
        if (this.authService.role === 'masterUser') {
          if (
            url.match('/user/dashboard/integration-status') ||
            url.match('/user/dashboard/products') ||
            url.match('/user/sync-logs/products') ||
            url.match('/user/sync-logs/orders') ||
            url.match('/user/settings/integrations') ||
            url.match('/user/settings/source-channel') ||
            url.match('/user/settings/custom-integration-request') ||
            url.match('/user/settings/users')
          ) {
            return true;
          }
        }
        if (this.authService.role === 'user') {
          if (
            url.match('/user/dashboard/integration-status') ||
            url.match('/user/dashboard/products') ||
            url.match('/user/sync-logs/products') ||
            url.match('/user/sync-logs/orders')
          ) {
            return true;
          }
        }
        this.router.navigate(['page-not-found']);
        return false;
      }
    }
    this.router.navigate(['not-authorized']);
    return false;
  }
}
