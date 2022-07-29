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
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { SettingsSidebarModule } from './common/settings-sidebar/settings-sidebar.module';
import { SettingsComponent } from './settings.component';
import { AllIntegrationsComponent } from './integrations/all-integrations/all-integrations.component';
import { SettingsResolver } from './settings.resolver';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddIntegrationModule } from './integrations/add-integration/add-integration.module';
import { AddIntegrationComponent } from './integrations/add-integration/add-integration.component';

const routes: Route[] = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            {
                path: 'integrations',
                component: AllIntegrationsComponent,
                resolve: {
                    data: SettingsResolver,
                },
            },
        ],
    },
];

@NgModule({
    declarations: [SettingsComponent, AllIntegrationsComponent],
    imports: [
        RouterModule.forChild(routes),
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
