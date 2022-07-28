import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetInitialsPipe } from './get-initials.pipe';

const pipes = [GetInitialsPipe];

@NgModule({
    declarations: [...pipes],
    imports: [CommonModule],
    exports: [...pipes],
})
export class PipesModule {}
