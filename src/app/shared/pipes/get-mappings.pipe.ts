import { Pipe, PipeTransform } from '@angular/core';
import { SelectOption } from 'app/modules/admin/settings/integrations/integrations.types';

@Pipe({
  name: 'getMappings',
})
export class GetMappingsPipe implements PipeTransform {
  transform(mappings: any[], key: string): SelectOption[] {
    return mappings?.find(mapping => mapping.key === key);
  }
}
