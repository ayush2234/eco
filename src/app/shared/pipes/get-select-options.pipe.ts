import { Pipe, PipeTransform } from '@angular/core';
import { SelectOption } from 'app/modules/admin/settings/integrations/integrations.types';

@Pipe({
    name: 'getSelectOptions',
})
export class GetSelectOptionsPipe implements PipeTransform {
    transform(
        selectOptions: { key: string; options: SelectOption[] }[],
        key: string
    ): SelectOption[] {
        return selectOptions?.find((selectOption) => selectOption.key === key)
            ?.options;
    }
}
