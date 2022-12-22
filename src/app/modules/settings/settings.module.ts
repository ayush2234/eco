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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddIntegrationModule } from './integrations/add-integration/add-integration.module';
import { SettingssRoutingModule } from './settings-routing.module';
import { SettingsUsersComponent } from './users/users.component';
import { SettingsAccountComponent } from './account/account.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IntegrationsModule } from './integrations/integrations.module';
import { CustomIntegrationRequestComponent } from './custom-integration-request/custom-integration-request.component';

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsUsersComponent,
    SettingsAccountComponent,
    CustomIntegrationRequestComponent,
  ],
  imports: [
    SettingssRoutingModule,
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
    IntegrationsModule,
  ],
})
export class SettingsModule {}
