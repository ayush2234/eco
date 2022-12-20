import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SyncLogsInventoryComponent } from './inventory/inventory.component';
import { SyncLogsOrdersComponent } from './orders/orders.component';
import { SyncLogsProductsComponent } from './products/products.component';
import { SyncLogsResolver } from '../../user/sync-logs/sync-logs.resolvers';
import { SyncLogsTrackingComponent } from './tracking/tracking.component';

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
    },
  },
  {
    path: 'products',
    component: SyncLogsProductsComponent,
    resolve: {
      syncLogs: SyncLogsResolver,
    },
  },
  // {
  //   path: 'inventory',
  //   component: SyncLogsInventoryComponent,
  //   resolve: {
  //     syncLogs: SyncLogsResolver,
  //   },
  // },
  // {
  //   path: 'tracking',
  //   component: SyncLogsTrackingComponent,
  //   resolve: {
  //     syncLogs: SyncLogsResolver,
  //   },
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SyncLogsRoutingModule {}
