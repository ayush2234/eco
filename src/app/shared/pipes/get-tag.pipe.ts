import { Pipe, PipeTransform } from '@angular/core';
import { Tag } from 'app/layout/common/grid/grid.types';
import { SyncOption } from 'app/modules/settings/integrations/integration.types';

@Pipe({
  name: 'getTag',
})
export class GetTagPipe implements PipeTransform {
  transform(id: string, tags: Tag[]): Tag {
    return tags?.find(tag => tag.id === id);
  }
}
