import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { IPagination, ITag } from 'app/layout/common/types/grid.types';
import { catchError, Observable, throwError } from 'rxjs';
import { UsersService } from './users.service';
import { User } from './users.types';

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
        pagination: IPagination;
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
    ): Observable<ITag[]> {
        return this._inventoryService.getTags();
    }
}
