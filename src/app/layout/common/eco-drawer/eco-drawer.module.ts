import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcoDrawerComponent } from './eco-drawer.component';
import { PortalModule } from '@angular/cdk/portal';
import { FuseDrawerModule } from '@fuse/components/drawer';

@NgModule({
    declarations: [EcoDrawerComponent],
    imports: [CommonModule, PortalModule, FuseDrawerModule],
    exports: [EcoDrawerComponent],
})
export class EcoDrawerModule {}
