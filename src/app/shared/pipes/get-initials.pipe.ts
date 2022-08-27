import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getInitials',
})
export class GetInitialsPipe implements PipeTransform {
  transform(value: string): unknown {
    return value.replace(/[a-z]/g, '').replace(' ', '');
  }
}
