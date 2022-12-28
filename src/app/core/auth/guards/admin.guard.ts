import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const url = state.url;
    const role = this.authService.role;
    if (role === 'superAdmin' || role === 'admin') {
      if (role === 'superAdmin') {
        if (
          url.match('/admin/dashboard') ||
          url.match('/admin/companies/list') ||
          url.match('/admin/integrations/list') ||
          url.match('/admin/users/list') ||
          url.match('/admin/sources/list')
        ) {
          return true;
        }
      }
      if (role === 'admin') {
        if (
          url.match('/admin/dashboard') ||
          url.match('/admin/companies/list') ||
          url.match('/admin/users/list')
        ) {
          return true;
        }
      }
    } else {
      this.router.navigate(['page-not-found']);
      return false;
    }
  }
}
