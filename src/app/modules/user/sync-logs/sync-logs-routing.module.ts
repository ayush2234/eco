import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from 'app/core/auth/guards/user.guard';
import { IntegrationResolver } from 'app/modules/settings/integrations/integration.resolver';
import { SyncLogsOrdersComponent } from './orders/orders.component';
import { SyncLogsProductDetailsComponent } from './product/product-details/product-details.component';
import { SyncLogsProductComponent } from './product/product.component';
import { SyncLogsProductsComponent } from './products/products.component';
import {
  SyncLogsProductsListResolver,
  SyncLogsProductsResolver,
  SyncLogsResolver,
} from './sync-logs.resolvers';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'orders',
  },
  {
    path: 'orders',
    component: SyncLogsOrdersComponent,
    resolve: {
      syncLogs: SyncLogsResolver,
      integrations: IntegrationResolver,
    },
  },
  {
    path: 'products',
    component: SyncLogsProductsComponent,
    resolve: {
      syncLogs: SyncLogsProductsListResolver,
    },
  },
  {
    path: 'product',
    component: SyncLogsProductComponent,
    resolve: {
      syncLogs: SyncLogsProductsListResolver,
    },
  },
  {
    path: 'product/productDetails',
    component: SyncLogsProductDetailsComponent,
    resolve: {
      syncLogs: SyncLogsProductsListResolver,
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            'app/modules/user/sync-logs/product/product-details/product-details.module'
          ).then(m => m.ProductDetailsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SyncLogsRoutingModule {}
