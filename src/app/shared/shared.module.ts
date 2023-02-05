import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { PipesModule } from './pipes/pipes.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        PortalModule,
        FuseDrawerModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        PortalModule,
        FuseDrawerModule,
        MatSnackBarModule
    ],
})
export class SharedModule { }
