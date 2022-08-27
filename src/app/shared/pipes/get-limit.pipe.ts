import { Pipe, PipeTransform } from '@angular/core';
import { Limit } from 'app/modules/admin/companies/company.types';

@Pipe({
  name: 'getLimit',
})
export class GetLimitPipe implements PipeTransform {
  transform(value: Limit, key: string): string {
    const { used, limit } = value;
    return limit ? `${used}/${limit}` : '';
  }
}
