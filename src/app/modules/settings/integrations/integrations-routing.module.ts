import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationsComponent } from './integrations.component';
import { ConnectionsResolver } from './integrations.resolver';

const routes: Routes = [
  {
    path: '',
    component: IntegrationsComponent,
    resolve: {
      integrations: ConnectionsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntegrationsRoutingModule {}
