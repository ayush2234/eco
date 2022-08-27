import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FuseNavigationModule } from '@fuse/components/navigation/navigation.module';
import { SettingsSidebarComponent } from './sidebar.component';

@NgModule({
  declarations: [SettingsSidebarComponent],
  imports: [
    RouterModule.forChild([]),
    MatIconModule,
    MatProgressBarModule,
    FuseNavigationModule,
  ],
  exports: [SettingsSidebarComponent],
})
export class SettingsSidebarModule {}
