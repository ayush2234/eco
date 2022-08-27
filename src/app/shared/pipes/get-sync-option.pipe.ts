import { Pipe, PipeTransform } from '@angular/core';
import { SyncOption } from 'app/modules/admin/settings/integrations/integrations.types';

@Pipe({
  name: 'getSyncOption',
})
export class GetSyncOptionPipe implements PipeTransform {
  transform(syncOptions: SyncOption[], key: string): SyncOption {
    return syncOptions.find(option => option.key === key);
  }
}
