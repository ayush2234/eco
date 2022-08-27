import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
  syncLog as syncLogData,
  syncLogs as syncLogsData,
} from 'app/mock-api/api/sync-log/data';

@Injectable({
  providedIn: 'root',
})
export class SyncLogMockApi {
  private _syncLog: any = syncLogData;
  private _syncLogs: any[] = syncLogsData;

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
    // @ SyncLog - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/sync-log')
      .reply(() => [200, cloneDeep(this._syncLog)]);

    // -----------------------------------------------------------------------------------------------------
    // @ syncLogs - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/sync-logs', 300)
      .reply(({ request }) => {
        // Get available queries
        const search = request.params.get('search');
        const sort = request.params.get('sort') || 'name';
        const order = request.params.get('order') || 'asc';
        const page = parseInt(request.params.get('page') ?? '1', 10);
        const size = parseInt(request.params.get('size') ?? '10', 10);

        // Clone the syncLogs
        let syncLogs: any[] | null = cloneDeep(this._syncLogs);

        // Sort the syncLogs
        if (sort === 'id') {
          syncLogs.sort((a, b) => {
            const fieldA = a[sort].toString().toUpperCase();
            const fieldB = b[sort].toString().toUpperCase();
            return order === 'asc'
              ? fieldA.localeCompare(fieldB)
              : fieldB.localeCompare(fieldA);
          });
        } else {
          syncLogs.sort((a, b) =>
            order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
          );
        }

        // If search exists...
        if (search) {
          // Filter the syncLogs
          syncLogs = syncLogs.filter(
            contact =>
              contact.name &&
              contact.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Paginate - Start
        const syncLogsLength = syncLogs.length;

        // Calculate pagination details
        const begin = page * size;
        const end = Math.min(size * (page + 1), syncLogsLength);
        const lastPage = Math.max(Math.ceil(syncLogsLength / size), 1);

        // Prepare the pagination object
        let pagination = {};

        // If the requested page number is bigger than
        // the last possible page number, return null for
        // syncLogs but also send the last possible page so
        // the app can navigate to there
        if (page > lastPage) {
          syncLogs = null;
          pagination = {
            lastPage,
          };
        } else {
          // Paginate the results by size
          syncLogs = syncLogs.slice(begin, end);

          // Prepare the pagination mock-api
          pagination = {
            length: syncLogsLength,
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
            syncLogs,
            pagination,
          },
        ];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ syncLog - POST
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onPost('api/sync-log').reply(() => {
      // Generate a new syncLog
      const newsyncLog = {
        id: FuseMockApiUtils.guid(),
        email: '',
        name: 'A New SyncLog',
        tags: [],
        role: '',
        active: false,
      };

      // Unshift the new syncLog
      this._syncLogs.unshift(newsyncLog);

      // Return the response
      return [200, newsyncLog];
    });
    // -----------------------------------------------------------------------------------------------------
    // @ SyncLog - PATCH
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onPatch('api/sync-log').reply(({ request }) => {
      // Get the syncLog mock-api
      const syncLog = cloneDeep(request.body.syncLog);

      // Update the syncLog mock-api
      this._syncLog = assign({}, this._syncLog, syncLog);

      // Return the response
      return [200, cloneDeep(this._syncLog)];
    });
  }
}
