import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import {
  user as userData,
  users as usersData,
} from 'app/mock-api/api/user/data';

@Injectable({
  providedIn: 'root',
})
export class UserMockApi {
  private _user: any = userData;
  private _users: any[] = usersData;

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
    // @ User - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/user')
      .reply(() => [200, cloneDeep(this._user)]);

    // -----------------------------------------------------------------------------------------------------
    // @ users - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onGet('api/users', 300).reply(({ request }) => {
      // Get available queries
      const search = request.params.get('search');
      const sort = request.params.get('sort') || 'name';
      const order = request.params.get('order') || 'asc';
      const page = parseInt(request.params.get('page') ?? '1', 10);
      const size = parseInt(request.params.get('size') ?? '10', 10);

      // Clone the users
      let users: any[] | null = cloneDeep(this._users);

      // Sort the users
      if (sort === 'id' || sort === 'name' || sort === 'active') {
        users.sort((a, b) => {
          const fieldA = a[sort].toString().toUpperCase();
          const fieldB = b[sort].toString().toUpperCase();
          return order === 'asc'
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        });
      } else {
        users.sort((a, b) =>
          order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
        );
      }

      // If search exists...
      if (search) {
        // Filter the users
        users = users.filter(
          contact =>
            contact.name &&
            contact.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Paginate - Start
      const usersLength = users.length;

      // Calculate pagination details
      const begin = page * size;
      const end = Math.min(size * (page + 1), usersLength);
      const lastPage = Math.max(Math.ceil(usersLength / size), 1);

      // Prepare the pagination object
      let pagination = {};

      // If the requested page number is bigger than
      // the last possible page number, return null for
      // users but also send the last possible page so
      // the app can navigate to there
      if (page > lastPage) {
        users = null;
        pagination = {
          lastPage,
        };
      } else {
        // Paginate the results by size
        users = users.slice(begin, end);

        // Prepare the pagination mock-api
        pagination = {
          length: usersLength,
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
          users,
          pagination,
        },
      ];
    });

    // -----------------------------------------------------------------------------------------------------
    // @ user - POST
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onPost('api/user').reply(() => {
      // Generate a new user
      const newuser = {
        id: FuseMockApiUtils.guid(),
        email: '',
        name: 'A New User',
        tags: [],
        role: '',
        active: false,
      };

      // Unshift the new user
      this._users.unshift(newuser);

      // Return the response
      return [200, newuser];
    });
    // -----------------------------------------------------------------------------------------------------
    // @ User - PATCH
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onPatch('api/user').reply(({ request }) => {
      // Get the user mock-api
      const user = cloneDeep(request.body.user);

      // Update the user mock-api
      this._user = assign({}, this._user, user);

      // Return the response
      return [200, cloneDeep(this._user)];
    });
  }
}
