import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { IPagination, ITag } from 'app/layout/common/types/grid.types';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersResolver implements Resolve<any> {
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
        pagination: IPagination;
        users: User[];
    }> {
        return this._userService.getUsers();
    }
}

@Injectable({
    providedIn: 'root',
})
export class UserTagsResolver implements Resolve<any> {
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
    ): Observable<ITag[]> {
        return this._userService.getTags();
    }
}
