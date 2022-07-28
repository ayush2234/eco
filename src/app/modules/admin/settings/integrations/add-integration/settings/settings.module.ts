import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { AddIntegrationComponent } from 'app/modules/admin/settings/integrations/add-integration/settings/settings.component';
import { SettingsAccountComponent } from 'app/modules/admin/settings/integrations/add-integration/settings/account/account.component';
import { SettingsSecurityComponent } from 'app/modules/admin/settings/integrations/add-integration/settings/security/security.component';
import { SettingsPlanBillingComponent } from 'app/modules/admin/settings/integrations/add-integration/settings/plan-billing/plan-billing.component';
import { SettingsNotificationsComponent } from 'app/modules/admin/settings/integrations/add-integration/settings/notifications/notifications.component';
import { SettingsTeamComponent } from 'app/modules/admin/settings/integrations/add-integration/settings/team/team.component';

@NgModule({
    declarations: [
        AddIntegrationComponent,
        SettingsAccountComponent,
        SettingsSecurityComponent,
        SettingsPlanBillingComponent,
        SettingsNotificationsComponent,
        SettingsTeamComponent,
    ],
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        FuseAlertModule,
        SharedModule,
    ],
})
export class AddIntegrationModule {}
