import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SyncLogsRoutingModule } from './sync-logs-routing.module';
import { SyncLogsComponent } from './sync-logs.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { SyncLogsOrdersComponent } from './orders/orders.component';
import { SyncLogsInventoryComponent } from './inventory/inventory.component';
import { SyncLogsProductsComponent } from './products/products.component';
import { SyncLogsTrackingComponent } from './tracking/tracking.component';

@NgModule({
  declarations: [
    SyncLogsComponent,
    SyncLogsOrdersComponent,
    SyncLogsInventoryComponent,
    SyncLogsProductsComponent,
    SyncLogsTrackingComponent,
  ],
  imports: [
    SyncLogsRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSortModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    SharedModule,
  ],
})
export class SyncLogsModule {}
