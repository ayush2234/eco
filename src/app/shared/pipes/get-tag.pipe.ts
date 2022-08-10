import { Pipe, PipeTransform } from '@angular/core';
import { ITag } from 'app/layout/common/types/grid.types';
import { SyncOption } from 'app/modules/admin/settings/integrations/integrations.types';

@Pipe({
    name: 'getTag',
})
export class GetTagPipe implements PipeTransform {
    transform(id: string, tags: ITag[]): ITag {
        return tags?.find((tag) => tag.id === id);
    }
}
