import { NgModule } from '@angular/core';
import { EcoDrawerComponent } from './eco-drawer.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [EcoDrawerComponent],
  imports: [SharedModule],
  exports: [EcoDrawerComponent],
})
export class EcoDrawerModule {}
