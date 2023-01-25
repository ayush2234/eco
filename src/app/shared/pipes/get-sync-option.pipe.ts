import { Pipe, PipeTransform } from '@angular/core';
import { SyncOption } from 'app/modules/settings/integrations/integration.types';

@Pipe({
  name: 'getSyncOption',
})
export class GetSyncOptionPipe implements PipeTransform {
  transform(syncOptions: SyncOption[], key: string): SyncOption {
    return syncOptions.find(option => option.code === key);
  }
}
