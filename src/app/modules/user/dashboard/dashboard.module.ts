import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { IntegrationStatusComponent } from './integration-status/integration-status.component';
import { ProductsComponent } from './products/products.component';


@NgModule({
  declarations: [
    IntegrationStatusComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
