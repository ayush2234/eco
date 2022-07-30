import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { UsersService } from './users.service';
import { User, UserPagination, UserTag } from './users.types';

@Injectable({
    providedIn: 'root',
})
export class UsersResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _usersService: UsersService) {}

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
        pagination: UserPagination;
        users: User[];
    }> {
        return this._usersService.getUsers();
    }
}

@Injectable({
    providedIn: 'root',
})
export class InventoryTagsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: UsersService) {}

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
    ): Observable<UserTag[]> {
        return this._inventoryService.getTags();
    }
}
