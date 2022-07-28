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
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { SettingsSidebarModule } from './common/settings-sidebar/settings-sidebar.module';
import { SettingsComponent } from './settings.component';
import { SettingsIntegrationsComponent } from './settings-integrations/settings-integrations.component';
import { SettingsResolver } from './settings.resolver';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const routes: Route[] = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            {
                path: 'integrations',
                component: SettingsIntegrationsComponent,
                resolve: {
                    data: SettingsResolver,
                },
            },
        ],
    },
];

@NgModule({
    declarations: [SettingsComponent, SettingsIntegrationsComponent],
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
        NgApexchartsModule,
        SharedModule,
        SettingsSidebarModule,
    ],
})
export class SettingsModule {}