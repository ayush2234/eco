import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'app/core/auth/guards/admin.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('app/modules/admin/dashboard/dashboard.module').then(
        m => m.DashboardModule
      ),
  },
  {
    path: 'companies',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('app/modules/admin/companies/companies.module').then(
        m => m.CompaniesModule
      ),
  },
  {
    path: 'users',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('app/modules/admin/users/users.module').then(m => m.UsersModule),
  },
  {
    path: 'integrations',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('app/modules/admin/integrations/integrations.module').then(
        m => m.IntegrationsModule
      ),
  },
  {
    path: 'sources',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('app/modules/admin/sources/sources.module').then(
        m => m.SourcesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
