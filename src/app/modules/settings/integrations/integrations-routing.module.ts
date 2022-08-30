import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationsComponent } from './integrations.component';
import { IntegrationResolver } from './integration.resolver';

const routes: Routes = [
  {
    path: '',
    component: IntegrationsComponent,
    resolve: {
      integrations: IntegrationResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntegrationsRoutingModule {}
