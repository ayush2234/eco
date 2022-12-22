import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from 'app/core/auth/guards/user.guard';

const routes: Routes = [
  {
    
    path: 'dashboard',
    canActivate: [UserGuard],
    loadChildren: () =>
      import('app/modules/user/dashboard/dashboard.module').then(
        m => m.DashboardModule
      ),
  },
  {
    path: 'sync-logs',
    canActivate: [UserGuard],
    loadChildren: () =>
      import('app/modules/user/sync-logs/sync-logs.module').then(
        m => m.SyncLogsModule
      ),
  },
  {
    path: 'settings',
    canActivate: [UserGuard],
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
