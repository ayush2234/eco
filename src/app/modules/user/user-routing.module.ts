import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
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
  {
    path: 'settings',
    loadChildren: () =>
      import('app/modules/settings/settings.module').then(
        m => m.SettingsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
