import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { TenantsService } from './tenants.service';
import {
    InventoryBrand,
    InventoryCategory,
    InventoryProduct,
    InventoryPagination,
    InventoryTag,
    InventoryVendor,
} from './tenants.types';

@Injectable({
    providedIn: 'root',
})
export class InventoryBrandsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: TenantsService) {}

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
    ): Observable<InventoryBrand[]> {
        return this._inventoryService.getBrands();
    }
}

@Injectable({
    providedIn: 'root',
})
export class InventoryCategoriesResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: TenantsService) {}

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
    ): Observable<InventoryCategory[]> {
        return this._inventoryService.getCategories();
    }
}

@Injectable({
    providedIn: 'root',
})
export class InventoryProductResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _inventoryService: TenantsService,
        private _router: Router
    ) {}

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
    ): Observable<InventoryProduct> {
        return this._inventoryService
            .getProductById(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested product is not available
                catchError((error) => {
                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url
                        .split('/')
                        .slice(0, -1)
                        .join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}

@Injectable({
    providedIn: 'root',
})
export class InventoryProductsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: TenantsService) {}

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
        pagination: InventoryPagination;
        products: InventoryProduct[];
    }> {
        return this._inventoryService.getProducts();
    }
}

@Injectable({
    providedIn: 'root',
})
export class InventoryTagsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: TenantsService) {}

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
    ): Observable<InventoryTag[]> {
        return this._inventoryService.getTags();
    }
}

@Injectable({
    providedIn: 'root',
})
export class InventoryVendorsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _inventoryService: TenantsService) {}

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
    ): Observable<InventoryVendor[]> {
        return this._inventoryService.getVendors();
    }
}
