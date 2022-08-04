import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetInitialsPipe } from './get-initials.pipe';
import { GetSyncOptionPipe } from './get-sync-option.pipe';

const pipes = [GetInitialsPipe, GetSyncOptionPipe];

@NgModule({
    declarations: [...pipes],
    imports: [CommonModule],
    exports: [...pipes],
})
export class PipesModule {}
