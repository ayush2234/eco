import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
    debounceTime,
    map,
    Observable,
    startWith,
    Subject,
    takeUntil,
    tap,
} from 'rxjs';
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
import { FormControl } from '@angular/forms';

@Component({
    selector: 'modern-layout',
    styles: [
        `

        .bg-original {
            background-color: var(--fuse-original) !important;
        }
      .companyList
        .mat-select-trigger
        .mat-select-value
        .mat-select-value-text {
        color: white !important;
      }
      .mat-select-panel-wrap {
        margin-top: 12%;
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
    showFilter: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    companyControl: FormControl = new FormControl();
    filteredOptions: Observable<Array<any>>;
    filterText: FormControl = new FormControl('');
    color: string = null;
    logo: string = null;
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
    ) {
        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe(user => {
            this._userService.removeTheme();
            let note: any = user?.companies?.[0].note;
            if (note) {
                var obj: any = {};
                var properties = note.split("|");
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i].split(/:(.*)/s);
                    obj[property[0].trim()] = property[1].trim();
                }
                this.color = obj.color;
                this.logo = obj.logo;
                this._userService.generateTheme(this.color.trim());
            }
        })
    }

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
        this.companyControl.setValue(LocalStorageUtils.companyId);
        //get role of current logged in user
        this.role = this.authService.role;
        //get companies list of an user
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
        if (this.companies && this.companies?.length >= 10) {
            this.showFilter = true;
        } else {
            this.showFilter = false;
        }
        this.filteredOptions = this.filterText.valueChanges.pipe(
            debounceTime(50),
            startWith(''),
            map(target => target.toLowerCase()),
            map(target =>
                this.companies.filter(opt =>
                    opt.company_name.toLowerCase().includes(target)
                )
            )
        );
    }
    getOptionStyle(opt: any, filted: Array<any>): { [key: string]: any } {
        const style: { [key: string]: any } = {};
        style.display = filted.indexOf(opt) < 0 ? 'none' : '';
        return style;
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
        } else if (
            (this.role === 'user' || this.role === 'masterUser') &&
            this.user.companies?.length === 1
        ) {
            return true;
        } else {
            return false;
        }
    }
    showSwitchCompany() {
        if (
            (this.role === 'user' || this.role === 'masterUser') &&
            this.user.companies?.length > 1
        ) {
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

    //Selection change of a Company
    selectedCompany(event) {
        LocalStorageUtils.companyId = event.value;
        this._router.navigate(['/user/dashboard/integration-status']);
    }
    trackByFn(index: number, item: any): any {
        return item?.id || index;
    }
}
