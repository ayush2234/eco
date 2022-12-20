import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SourcesGridComponent } from './grid/sources-grid.component';
import { SourceCompanyResolver, SourceResolver } from './source.resolvers';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sources',
  },
  {
    path: 'sources',
    component: SourcesGridComponent,
    resolve: {
      sources: SourceResolver,
      companiess: SourceCompanyResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SourcesRoutingModule {}
