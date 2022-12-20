import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationsGridComponent } from './grid/integrations-grid.component';
import {
  IntegrationResolver,
  IntegrationSourceResolver,
  IntegrationCompanyResolver,
} from './integration.resolvers';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin',
  },
  {
    path: 'integrations',
    component: IntegrationsGridComponent,
    resolve: {
      integrations: IntegrationResolver,
      sources: IntegrationSourceResolver,
      companies: IntegrationCompanyResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntegrationsRoutingModule { }
