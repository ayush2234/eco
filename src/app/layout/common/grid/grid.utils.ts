// -----------------------------------------------------------------------------------------------------
// @ GRID UTILITIES
//
// Methods are derivations of the Auth0 Angular-JWT helper service methods
// https://github.com/auth0/angular2-jwt
// -----------------------------------------------------------------------------------------------------

import { Pageable, Pagination } from './grid.types';

export class GridUtils {
  /**
   * Constructor
   */
  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create Pagination
   *
   * @param token
   * @param offsetSeconds
   */
  static getPagination(result: Pageable): Pagination {
    // Get available queries
    const page = parseInt(
      result?.result_info?.page_number?.toString() ?? '1',
      10
    );

    const size = parseInt(
      result?.result_info?.item_per_page?.toString() ?? '10',
      10
    );

    // Paginate - Start
    const length = result.result_info.total_records;

    // Calculate pagination details
    const begin = page * size;
    const end = Math.min(size * (page + 1), length);
    const lastPage = Math.max(Math.ceil(length / size), 1);

    // Prepare the pagination object
    let pagination: Pagination;

    // If the requested page number is bigger than
    // the last possible page number, return null for
    // integrations but also send the last possible page so
    // the app can navigate to there
    if (page > lastPage) {
      pagination = {
        lastPage,
      };
    } else {
      pagination = {
        length: length,
        size: size,
        page: page,
        lastPage: lastPage,
        startIndex: begin,
        endIndex: end - 1,
      };
    }

    return pagination;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
}
