import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { SettingsSidebarModule } from './common/sidebar/sidebar.module';
import { SettingsComponent } from './settings.component';
import { AllIntegrationsComponent } from './integrations/all-integrations/all-integrations.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddIntegrationModule } from './integrations/add-integration/add-integration.module';
import { SettingssRoutingModule } from './settings-routing.module';
import { SourceChannelComponent } from './integrations/source-channel/source-channel.component';
import { SettingsUsersComponent } from './users/users.component';
import { SettingsAccountComponent } from './account/account.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [
        SettingsComponent,
        AllIntegrationsComponent,
        SourceChannelComponent,
        SettingsUsersComponent,
        SettingsAccountComponent,
    ],
    imports: [
        SettingssRoutingModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatTabsModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        SharedModule,
        SettingsSidebarModule,
        AddIntegrationModule,
    ],
})
export class SettingsModule {}
