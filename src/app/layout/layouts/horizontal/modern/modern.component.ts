import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
  FuseNavigationService,
  FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';

import { Router } from '@angular/router';

@Component({
  selector: 'modern-layout',
  styles: [
    `
      .companyList
        .mat-select-trigger
        .mat-select-value
        .mat-select-value-text {
        color: white !important;
      }
      .mat-select-panel-wrap {
        margin-top: 15%;
      }
      .companyList .mat-select-placeholder {
        color: white !important;
      }
    `,
  ],
  templateUrl: './modern.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ModernLayoutComponent implements OnInit, OnDestroy {
  isScreenSmall: boolean;
  navigation: Navigation;
  user: User;
  role: string;
  companyName: string;
  selectedCompanyName: string;
  companies = [];
  filteredCompanyTags = [];
  showFilter: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * Constructor
   */
  constructor(
    private _navigationService: NavigationService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,
    private _userService: UserService,
    private authService: AuthService,
    private _router: Router
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for current year
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */

  ngOnInit(): void {
    //get role of current logged in user
    this.role = this.authService.role;
    //get companies list of an user
    this.filteredCompanyTags = this._userService.companyList;
    this.companies = this._userService.companyList;
    // Subscribe to navigation data
    this._navigationService.navigation$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((navigation: Navigation) => {
        this.navigation = navigation;
      });
    //selected Company Name
    this.selectedCompanyName = LocalStorageUtils.companyName;
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.user = user;
        if (LocalStorageUtils.impersonate == 'true') {
          this.companyName = LocalStorageUtils.companyName;
        } else {
          this.companyName =
            user.companies && user.companies.length > 0
              ? user.companies[0].company_name
              : 'Wolfgroup';
        }
      });
    if (this.companies.length >= 10) {
      this.showFilter = true;
    } else {
      this.showFilter = false;
    }
  }
  showSettings() {
    if (this.role === 'masterUser') {
      return true;
    } else if (
      (this.role === 'admin' || this.role === 'superAdmin') &&
      LocalStorageUtils.impersonate
    ) {
      return true;
    } else {
      return false;
    }
  }
  showCompany() {
    if (this.role === 'admin' || this.role === 'superAdmin') {
      return true;
    } else {
      return false;
    }
  }
  showSwitchCompany() {
    if (this.role === 'user' || this.role === 'masterUser') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle navigation
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation =
      this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
        name
      );

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }

  //Filters companies
  filterCompanyTags(event): void {
    // Get the value
    const value = event.target.value.toLowerCase();
    // Filter the companies
    this.filteredCompanyTags = this.companies.filter(tag =>
      tag.company_name.toLowerCase().includes(value)
    );
  }

  //selected Company
  selectedCompany(event) {
    LocalStorageUtils.companyId = event.value.company_id;
    LocalStorageUtils.companyName = event.value.company_name;
    this._router.navigate(['/user/dashboard/integration-status']);
  }
  trackByFn(index: number, item: any): any {
    return item?.id || index;
  }
}
