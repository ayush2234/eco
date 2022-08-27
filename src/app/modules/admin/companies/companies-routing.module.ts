import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesGridComponent } from './grid/companies-grid.component';
import {
  CompanyIntegrationResolver,
  CompanyResolver,
} from './company.resolvers';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: CompaniesGridComponent,
    resolve: {
      companies: CompanyResolver,
      integrations: CompanyIntegrationResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenantsRoutingModule {}
