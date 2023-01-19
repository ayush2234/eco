// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

// import { SyncLogsRoutingModule } from './sync-logs-routing.module';
// import { OrdersComponent } from './orders/orders.component';
// import { ProductsComponent } from './products/products.component';

// @NgModule({
//   declarations: [
//     OrdersComponent,
//     ProductsComponent
//   ],
//   imports: [
//     CommonModule,
//     SyncLogsRoutingModule
//   ]
// })
// export class SyncLogsModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SyncLogsRoutingModule } from './sync-logs-routing.module';

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

import { SyncLogsProductsComponent } from './products/products.component';
import { ViewOrderDetailsComponent } from './orders/view-order-details/view-order-details.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    SyncLogsOrdersComponent,
    SyncLogsProductsComponent,
    ViewOrderDetailsComponent,
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
    MatNativeDateModule,
    MatDatepickerModule,
  ],
})
export class SyncLogsModule {}
