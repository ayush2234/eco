import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyIntegrationResolver } from 'app/modules/admin/companies/company.resolvers';
import { SyncLogsOrdersComponent } from './orders/orders.component';

import { SyncLogsProductsComponent } from './products/products.component';
import { SyncLogsResolver } from './sync-logs.resolvers';

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
      integrations: CompanyIntegrationResolver,
    },
  },
  {
    path: 'products',
    component: SyncLogsProductsComponent,
    resolve: {
      syncLogs: SyncLogsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SyncLogsRoutingModule {}
