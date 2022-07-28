import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PipesModule],
    exports: [CommonModule, FormsModule, ReactiveFormsModule, PipesModule],
})
export class SharedModule {}
