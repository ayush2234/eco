import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SourcesComponent } from './sources.component';
import { SourceResolver } from './source.resolver';

const routes: Routes = [
  {
    path: '',
    component: SourcesComponent,
    resolve: {
      integrations: SourceResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SourcesRoutingModule {}
