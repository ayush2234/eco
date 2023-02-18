import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationResolver } from 'app/modules/settings/integrations/integration.resolver';
import {
  SyncLogsProductsListResolver,
  SyncLogsResolver,
} from '../../sync-logs.resolvers';
import { SyncLogsProductComponent } from '../product.component';
import { ProductAssetsComponent } from './product-assets/product-assets.component';
import { ProductAttributeComponent } from './product-attribute/product-attribute.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'productAttribute',
  },
  {
    path: 'productAttribute',
    component: ProductAttributeComponent,
  },
  {
    path: 'productAssets',
    component: ProductAssetsComponent,
  },
  // {
  //   path: 'product',
  //   component: SyncLogsProductComponent,
  //   resolve: {
  //     syncLogs: SyncLogsProductsListResolver,
  //   },
  // },
  // {
  //   path: 'product/productDetails',
  //   component: SyncLogsProductDetailsComponent,
  //   resolve: {
  //     syncLogs: SyncLogsProductsListResolver,
  //   },
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductDetailsRoutingModule {}
