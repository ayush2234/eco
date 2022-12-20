import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: 'dashboard',
  loadChildren: () =>
    import('app/modules/admin/dashboard/dashboard.module').then(
      m => m.DashboardModule
    ),
},
{
  path: 'companies',
  loadChildren: () =>
    import('app/modules/admin/companies/companies.module').then(
      m => m.CompaniesModule
    ),
},
{
  path: 'users',
  loadChildren: () =>
    import('app/modules/admin/users/users.module').then(
      m => m.UsersModule
    ),
},
{
  path: 'integrations',
  loadChildren: () =>
    import('app/modules/admin/integrations/integrations.module').then(
      m => m.IntegrationsModule
    ),
},
{
  path: 'sources',
  loadChildren: () =>
    import('app/modules/admin/sources/sources.module').then(
      m => m.SourcesModule
    ),
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
// {
  //   path: '',
  //   canActivate: [AuthGuard],
  //   canActivateChild: [AuthGuard],
  //   component: LayoutComponent,
  //   resolve: {
  //     initialData: InitialDataResolver,
  //   },
  //   children: [
  //     {
  //       path: 'dashboard/admin',
  //       loadChildren: () =>
  //         import('app/modules/admin/dashboard/dashboard.module').then(
  //           m => m.DashboardModule
  //         ),
  //     },
  //     {
  //       path: 'settings',
  //       loadChildren: () =>
  //         import('app/modules/settings/settings.module').then(
  //           m => m.SettingsModule
  //         ),
  //     },
  //     {
  //       path: 'companies/admin',
  //       loadChildren: () =>
  //         import('app/modules/admin/companies/companies.module').then(
  //           m => m.CompaniesModule
  //         ),
  //     },
  //     {
  //       path: 'users/admin',
  //       loadChildren: () =>
  //         import('app/modules/admin/users/users.module').then(
  //           m => m.UsersModule
  //         ),
  //     },
  //     {
  //       path: 'sync-logs',
  //       loadChildren: () =>
  //         import('app/modules/admin/sync-logs/sync-logs.module').then(
  //           m => m.SyncLogsModule
  //         ),
  //     },
  //     {
  //       path: 'integrations/admin',
  //       loadChildren: () =>
  //         import('app/modules/admin/integrations/integrations.module').then(
  //           m => m.IntegrationsModule
  //         ),
  //     },
  //     {
  //       path: 'admin',
  //       loadChildren: () =>
  //         import('app/modules/admin/sources/sources.module').then(
  //           m => m.SourcesModule
  //         ),
  //     },
  //   ],
  // },