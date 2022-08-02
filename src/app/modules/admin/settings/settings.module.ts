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
import { SettingsSidebarModule } from './common/settings-sidebar/settings-sidebar.module';
import { SettingsComponent } from './settings.component';
import { AllIntegrationsComponent } from './integrations/all-integrations/all-integrations.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddIntegrationModule } from './integrations/add-integration/add-integration.module';
import { SettingssRoutingModule } from './integrations/settings-routing.module';
import { SourceChannelComponent } from './integrations/source-channel/source-channel.component';

@NgModule({
    declarations: [
        SettingsComponent,
        AllIntegrationsComponent,
        SourceChannelComponent,
    ],
    imports: [
        SettingssRoutingModule,
        MatButtonModule,
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
