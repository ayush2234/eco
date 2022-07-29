import { NgModule } from '@angular/core';
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
import { AddIntegarationConnectionComponent } from './connection/connection.component';
import { AddIntegrationComponent } from './add-integration.component';
import { AddIntegrationProductsComponent } from './products/products.component';
import { AddIntegrationOrdersComponent } from './orders/orders.component';
import { AddIntegrationInventoryComponent } from './inventory/inventory.component';
import { AddIntegrationTrackingComponent } from './tracking/tracking.component';

@NgModule({
    declarations: [
        AddIntegrationComponent,
        AddIntegarationConnectionComponent,
        AddIntegrationInventoryComponent,
        AddIntegrationOrdersComponent,
        AddIntegrationProductsComponent,
        AddIntegrationTrackingComponent,
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
