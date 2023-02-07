import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search',
    pure: false
})
export class SearchPipe implements PipeTransform {
    transform(items: any[], key: string, query: string): any {
        if (!items || !query) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item[key].includes(query));
    }
}
