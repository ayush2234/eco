import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AllIntegrationsComponent } from './integrations/all-integrations/all-integrations.component';
import { ConnectionsResolver } from './integrations/integrations.resolver';
import { SourceChannelComponent } from './integrations/source-channel/source-channel.component';
import { SettingsUsersComponent } from './users/users.component';
import { SettingAccountResolver } from './account/account.resolver';
import { SettingsAccountComponent } from './account/account.component';

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
            {
                path: 'users',
                component: SettingsUsersComponent,
            },
            {
                path: 'account',
                component: SettingsAccountComponent,
                resolve: {
                    user: SettingAccountResolver,
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
