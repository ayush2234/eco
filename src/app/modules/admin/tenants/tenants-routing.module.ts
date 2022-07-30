import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantsGridComponent } from './grid/tenants-grid.component';
import {
    InventoryBrandsResolver,
    InventoryCategoriesResolver,
    InventoryProductsResolver,
    InventoryTagsResolver,
    InventoryVendorsResolver,
} from './tenants.resolvers';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
    },
    {
        path: 'list',
        component: TenantsGridComponent,
        resolve: {
            brands: InventoryBrandsResolver,
            categories: InventoryCategoriesResolver,
            products: InventoryProductsResolver,
            tags: InventoryTagsResolver,
            vendors: InventoryVendorsResolver,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TenantsRoutingModule {}
