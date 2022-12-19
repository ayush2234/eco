import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, of } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { adminNavigationItems, masterUserNavigationItems, superAdminNavigationItems, userNavigationItems } from './navigation.data';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _navigation: ReplaySubject<Navigation> =
    new ReplaySubject<Navigation>(1);

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for navigation
   */
  get navigation$(): Observable<Navigation> {
    return this._navigation.asObservable();
  }

  superAdminNavigation: Navigation = {
    compact: superAdminNavigationItems,
    default: superAdminNavigationItems,
    futuristic: superAdminNavigationItems,
    horizontal: superAdminNavigationItems,
  }

  adminNavigation: Navigation = {
    compact: adminNavigationItems,
    default: adminNavigationItems,
    futuristic: adminNavigationItems,
    horizontal: adminNavigationItems
  }

  userNavigation: Navigation = {
    compact: userNavigationItems,
    default: userNavigationItems,
    futuristic: userNavigationItems,
    horizontal: userNavigationItems
  }

  masterUserNavigation: Navigation = {
    compact: masterUserNavigationItems,
    default: masterUserNavigationItems,
    futuristic: masterUserNavigationItems,
    horizontal: masterUserNavigationItems
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get all navigation data
   */


  get(): Observable<Navigation> {
    const currentLoggedInRole = localStorage.getItem('role');

    if (currentLoggedInRole === 'superAdmin') {
      this._navigation.next(this.superAdminNavigation);
      return of(this.superAdminNavigation)
    }
    else if (currentLoggedInRole === 'admin') {
      this._navigation.next(this.adminNavigation);
      return of(this.adminNavigation)
    }
    else {
      this._navigation.next(this.userNavigation)
      return of(this.userNavigation)
    }

  }
}
