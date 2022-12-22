import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { SettingsUsersComponent } from './users/users.component';
import { SettingAccountResolver } from './account/account.resolver';
import { SettingsAccountComponent } from './account/account.component';
import { CustomIntegrationRequestComponent } from './custom-integration-request/custom-integration-request.component';

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
        loadChildren: () =>
          import('app/modules/settings/integrations/integrations.module').then(
            m => m.IntegrationsModule
          ),
      },
      {
        path: 'source-channel',
        loadChildren: () =>
          import('app/modules/settings/sources/sources.module').then(
            m => m.SourcesModule
          ),
      },
      {
        path: 'custom-integration-request',
       component:CustomIntegrationRequestComponent
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
