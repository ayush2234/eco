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
import { SyncLogsService } from 'app/modules/user/sync-logs/sync-logs.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'modern-layout',
  styles: [
    `
      .companyList
        .mat-select-trigger
        .mat-select-value
        .mat-select-value-text {
        color: white;
      }
      .mat-select-panel-wrap {
        margin-top: 15%;
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
  companies = [];
  filteredCompanyTags = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  companyId = new FormControl(LocalStorageUtils.companyId);

  /**
   * Constructor
   */
  constructor(
    private _navigationService: NavigationService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,
    private _userService: UserService,
    private authService: AuthService,
    private _syncLogService: SyncLogsService
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
    console.log(this.companyId.value);
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
  selectedCompany(event) {
    LocalStorageUtils.companyId = event.value;
    this._syncLogService.getSyncLogOrders().subscribe(res => {
      // console.log(res);
    });
  }
  filterCompanyTags(event): void {
    // Get the value
    const value = event.target.value.toLowerCase();
    // Filter the companies
    this.filteredCompanyTags = this.companies.filter(tag =>
      tag.company_name.toLowerCase().includes(value)
    );

    console.log(this.filteredCompanyTags);
  }
  filterCompanyTagsInputKeyDown(event): void {
    // Return if the pressed key is not 'Enter'
    if (event.key !== 'Enter') {
      return;
    }

    // If there is no tag available...
    if (this.filteredCompanyTags.length === 0) {
      // Clear the input
      event.target.value = '';

      // Return
      return;
    }
  }
}
