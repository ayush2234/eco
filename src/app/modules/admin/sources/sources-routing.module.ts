import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SourcesGridComponent } from './grid/sources-grid.component';
import {
    SourceRestrictedToCompanyResolver,
    SourceResolver,
    SourceSourceResolver,
} from './source.resolvers';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
    },
    {
        path: 'list',
        component: SourcesGridComponent,
        resolve: {
            sources: SourceResolver,
            integrationTags: SourceSourceResolver,
            restrictedToCompanyTags: SourceRestrictedToCompanyResolver,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SourcesRoutingModule {}
