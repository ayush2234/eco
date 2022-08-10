import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationsGridComponent } from './grid/integrations-grid.component';
import {
    IntegrationRestrictedToCompanyResolver,
    IntegrationResolver,
    IntegrationSourceResolver,
} from './integration.resolvers';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
    },
    {
        path: 'list',
        component: IntegrationsGridComponent,
        resolve: {
            integrations: IntegrationResolver,
            sourceTags: IntegrationSourceResolver,
            restrictedToCompanyTags: IntegrationRestrictedToCompanyResolver,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IntegrationsRoutingModule {}
