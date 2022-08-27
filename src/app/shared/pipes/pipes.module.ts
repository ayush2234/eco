import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetInitialsPipe } from './get-initials.pipe';
import { GetSyncOptionPipe } from './get-sync-option.pipe';
import { GetSelectOptionsPipe } from './get-select-options.pipe';
import { GetMappingsPipe } from './get-mappings.pipe';
import { GetTagPipe } from './get-tag.pipe';
import { GetLimitPipe } from './get-limit.pipe';

const pipes = [
  GetInitialsPipe,
  GetSyncOptionPipe,
  GetSelectOptionsPipe,
  GetMappingsPipe,
  GetTagPipe,
  GetLimitPipe,
];

@NgModule({
  declarations: [...pipes],
  imports: [CommonModule],
  exports: [...pipes],
})
export class PipesModule {}
