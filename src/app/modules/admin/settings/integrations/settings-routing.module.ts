import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SettingsComponent } from '../settings.component';
import { AllIntegrationsComponent } from './all-integrations/all-integrations.component';
import { ConnectionsResolver } from './integrations.resolver';
import { SourceChannelComponent } from './source-channel/source-channel.component';

const routes: Route[] = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'integrations',
            },
            {
                path: 'integrations',
                component: AllIntegrationsComponent,
                resolve: {
                    integrations: ConnectionsResolver,
                },
            },
            {
                path: 'source-channel',
                component: SourceChannelComponent,
                resolve: {
                    erps: ConnectionsResolver,
                },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingssRoutingModule {}
