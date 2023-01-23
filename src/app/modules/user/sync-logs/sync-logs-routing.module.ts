import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationResolver } from 'app/modules/settings/integrations/integration.resolver';
import { SyncLogsOrdersComponent } from './orders/orders.component';
import { SyncLogsProductsComponent } from './products/products.component';
import {
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
      syncLogs: SyncLogsProductsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SyncLogsRoutingModule {}
