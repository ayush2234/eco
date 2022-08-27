import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
  sources as sourcesData,
  companies,
} from 'app/mock-api/api/sources/data';

@Injectable({
  providedIn: 'root',
})
export class SourceMockApi {
  private _sources: any = sourcesData?.sources;

  /**
   * Constructor
   */
  constructor(private _fuseMockApiService: FuseMockApiService) {
    // Register Mock API handlers
    this.registerHandlers();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register Mock API handlers
   */
  registerHandlers(): void {
    // -----------------------------------------------------------------------------------------------------
    // @ sources - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onGet('api/sources', 300).reply(({ request }) => {
      // Get available queries
      const search = request.params.get('search');
      const sort = request.params.get('sort') || 'name';
      const order = request.params.get('order') || 'asc';
      const page = parseInt(request.params.get('page') ?? '1', 10);
      const size = parseInt(request.params.get('size') ?? '10', 10);

      // Clone the sources
      let sources: any[] | null = cloneDeep(this._sources);

      // Sort the sources
      if (sort === 'id' || sort === 'name' || sort === 'active') {
        sources.sort((a, b) => {
          const fieldA = a[sort].toString().toUpperCase();
          const fieldB = b[sort].toString().toUpperCase();
          return order === 'asc'
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        });
      } else {
        sources.sort((a, b) =>
          order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
        );
      }

      // If search exists...
      if (search) {
        // Filter the sources
        sources = sources.filter(
          contact =>
            contact.name &&
            contact.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Paginate - Start
      const sourcesLength = sources.length;

      // Calculate pagination details
      const begin = page * size;
      const end = Math.min(size * (page + 1), sourcesLength);
      const lastPage = Math.max(Math.ceil(sourcesLength / size), 1);

      // Prepare the pagination object
      let pagination = {};

      // If the requested page number is bigger than
      // the last possible page number, return null for
      // sources but also send the last possible page so
      // the app can navigate to there
      if (page > lastPage) {
        sources = null;
        pagination = {
          lastPage,
        };
      } else {
        // Paginate the results by size
        sources = sources.slice(begin, end);

        // Prepare the pagination mock-api
        pagination = {
          length: sourcesLength,
          size: size,
          page: page,
          lastPage: lastPage,
          startIndex: begin,
          endIndex: end - 1,
        };
      }

      // Return the response
      return [
        200,
        {
          sources: sources,
          pagination,
        },
      ];
    });

    // -----------------------------------------------------------------------------------------------------
    // @ source - POST
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onPost('api/sources').reply(() => {
      // Generate a new source
      const newsource = {
        sourceId: FuseMockApiUtils.guid(),
        name: 'A New Source',
      };

      // Unshift the new source
      this._sources.unshift(newsource);

      // Return the response
      return [200, newsource];
    });
    // -----------------------------------------------------------------------------------------------------
    // @ Source - PATCH
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onPatch('api/sources').reply(({ request }) => {
      // Get the source mock-api
      const source = cloneDeep(request.body.source);

      // Update the source mock-api
      this._sources = assign({}, this._sources, source);

      // Return the response
      return [200, cloneDeep(this._sources)];
    });
  }
}
