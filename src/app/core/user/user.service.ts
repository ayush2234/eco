/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { Pagination, Tag } from 'app/layout/common/grid/grid.types';
import {
  CreateUser,
  GetUserByTokenResponse,
  User,
  UserListResponse,
} from 'app/core/user/user.types';
import { appConfig } from '../config/app.config';
import { AuthUtils } from '../auth/auth.utils';
import { EcommifyApiResponse } from '../api/api.types';
import { LocalStorageUtils } from '../common/local-storage.utils';
import { GridUtils } from 'app/layout/common/grid/grid.utils';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Private
  private _config = appConfig;
  private _user: BehaviorSubject<User | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
  private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(
    null
  );
  private _companyTags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(
    null
  );

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient, private _router: Router) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for user
   *
   * @param value
   */
  set user(value: User) {
    // Store the value
    this._user.next(value);
  }

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  /**
   * Getter for users
   */
  get users$(): Observable<User[]> {
    return this._users.asObservable();
  }

  /**
   * Getter for pagination
   */
  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  /**
   * Getter for tags
   */
  get tags$(): Observable<Tag[]> {
    return this._companyTags.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get users
   *
   *
   * @param page
   * @param size
   * @param sort
   * @param order
   * @param search
   */

  getUsers(
    page: number = 0,
    size: number = 10,
    sort: string = 'name',
    order: 'asc' | 'desc' | '' = 'asc',
    search: string = ''
  ): Observable<EcommifyApiResponse<UserListResponse>> {
    const api = this._config?.apiConfig?.baseUrl;

    return this._httpClient
      .get<EcommifyApiResponse<UserListResponse>>(`${api}/admin/users`, {
        params: {
          page: '' + page,
          size: '' + size,
          sort,
          order,
          search,
        },
      })
      .pipe(
        tap(response => {
          const updatedUsers = response.result.users.map(user => {
            let companyList = [];
            user.companies.map(it => {
              companyList.push(it.company_id);
            });
            user.companies = companyList;
            return user;
          });

          const pagination = GridUtils.getPagination(response.result);
          this._pagination.next(pagination);
          this._users.next(updatedUsers);
        })
      );
  }

  /**
   * Get the current logged in user data
   */
  get(): Observable<EcommifyApiResponse<GetUserByTokenResponse>> {
    const api = this._config?.apiConfig?.baseUrl;
    const token = LocalStorageUtils.accessToken;

    return this._httpClient
      .get<EcommifyApiResponse<GetUserByTokenResponse>>(
        `${api}/auth/get-user-details-by-token?token=${token}`
      )
      .pipe(
        tap(response => {
          const user = response.result;

          // Store the token expiration date in the local storage
          LocalStorageUtils.tokenExpirationDate = user?.expire_at;
          if (user.role === 'masterUser' || user.role === 'user') {
            if (user.companies && user.companies.length > 0) {
              LocalStorageUtils.companyId = user.companies[0].company_id;
              LocalStorageUtils.companyName = user.companies[0].company_name;
            } else {
              this._router.navigate(['not-authorized']);
            }
          }

          this._user.next(user);
        })
      );
  }

  /**
   * Get user by id
   */
  getUserById(id: string): Observable<User> {
    return this._users.pipe(
      take(1),
      map(users => {
        // Find the user
        const user = users.find(item => item.id === id) || null;

        // Return the user
        return user;
      }),
      switchMap(user => {
        if (!user) {
          return throwError('Could not found user with id of ' + id + '!');
        }

        return of(user);
      })
    );
  }

  /**
   * Create user
   */
  createUser(user: CreateUser): Observable<User> {
    const api = this._config?.apiConfig?.baseUrl;

    return this.users$.pipe(
      take(1),
      switchMap(users =>
        this._httpClient
          .post<EcommifyApiResponse<User>>(`${api}/admin/user`, user)
          .pipe(
            map(response => {
              const { result: newUser } = response;

              let companyList = [];
              newUser.companies.map(it => {
                companyList.push(it.company_id);
              });
              newUser.companies = companyList;

              // Update the users with the new user
              this._users.next([newUser, ...users]);

              // Return the new user
              return newUser;
            })
          )
      )
    );
  }

  /**
   * Update user
   *
   * @param id
   * @param user
   */
  updateUser(id: string, user: User): Observable<User> {
    const api = this._config?.apiConfig?.baseUrl;

    return this.users$.pipe(
      take(1),
      switchMap(users =>
        this._httpClient
          .put<EcommifyApiResponse<User>>(`${api}/admin/user/${id}`, user)
          .pipe(
            map(response => {
              const { result: updatedUser } = response;

              let companyList = [];
              updatedUser.companies.map(it => {
                companyList.push(it.company_id);
              });
              updatedUser.companies = companyList;
              // Find the index of the updated user
              const index = users.findIndex(item => item.id === id);

              // Update the user
              users[index] = updatedUser;

              // Update the users
              this._users.next(users);

              // Return the updated user
              return updatedUser;
            })
          )
      )
    );
  }

  /**
   * Delete the user
   *
   * @param id
   */
  deleteUser(id: string): Observable<boolean> {
    const api = this._config?.apiConfig?.baseUrl;

    return this.users$.pipe(
      take(1),
      switchMap(users =>
        this._httpClient
          .delete('api/user', {
            params: { id },
          })
          .pipe(
            map((isDeleted: boolean) => {
              // Find the index of the deleted user
              const index = users.findIndex(item => item.id === id);

              // Delete the user
              users.splice(index, 1);

              // Update the users
              this._users.next(users);

              // Return the deleted status
              return isDeleted;
            })
          )
      )
    );
  }
}
