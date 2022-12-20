import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 {
  path: '',
  loadChildren: () =>
    import('app/modules/user/dashboard/dashboard.module').then(
      m => m.DashboardModule
    ),
},
{
  path: 'sync-logs',
  loadChildren: () =>
    import('app/modules/user/sync-logs/sync-logs.module').then(
      m => m.SyncLogsModule
    ),
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
