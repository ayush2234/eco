import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { User } from './users.types';
import { IPagination, ITag } from 'app/layout/common/types/grid.types';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    // Private
    private _user: BehaviorSubject<User | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<IPagination | null> =
        new BehaviorSubject(null);
    private _tags: BehaviorSubject<ITag[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for user
     */
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
    get pagination$(): Observable<IPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for tags
     */
    get tags$(): Observable<ITag[]> {
        return this._tags.asObservable();
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
    ): Observable<{
        pagination: IPagination;
        users: User[];
    }> {
        return this._httpClient
            .get<{
                pagination: IPagination;
                users: User[];
            }>('api/common/users', {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    search,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._users.next(response.users);
                })
            );
    }

    /**
     * Get user by id
     */
    getUserById(id: string): Observable<User> {
        return this._users.pipe(
            take(1),
            map((users) => {
                // Find the user
                const user = users.find((item) => item.id === id) || null;

                // Update the user
                this._user.next(user);

                // Return the user
                return user;
            }),
            switchMap((user) => {
                if (!user) {
                    return throwError(
                        'Could not found user with id of ' + id + '!'
                    );
                }

                return of(user);
            })
        );
    }

    /**
     * Create user
     */
    createUser(): Observable<User> {
        return this.users$.pipe(
            take(1),
            switchMap((users) =>
                this._httpClient.post<User>('api/common/user', {}).pipe(
                    map((newUser) => {
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
        return this.users$.pipe(
            take(1),
            switchMap((users) =>
                this._httpClient
                    .patch<User>('api/common/user', {
                        id,
                        user,
                    })
                    .pipe(
                        map((updatedUser) => {
                            // Find the index of the updated user
                            const index = users.findIndex(
                                (item) => item.id === id
                            );

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
        return this.users$.pipe(
            take(1),
            switchMap((users) =>
                this._httpClient
                    .delete('api/common/user', {
                        params: { id },
                    })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted user
                            const index = users.findIndex(
                                (item) => item.id === id
                            );

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

    /**
     * Get tags
     */
    getTags(): Observable<ITag[]> {
        return this._httpClient
            .get<ITag[]>('api/apps/ecommerce/inventory/tags')
            .pipe(
                tap((tags) => {
                    this._tags.next(tags);
                })
            );
    }

    /**
     * Create tag
     *
     * @param tag
     */
    createTag(tag: ITag): Observable<ITag> {
        return this.tags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .post<ITag>('api/apps/ecommerce/inventory/tag', {
                        tag,
                    })
                    .pipe(
                        map((newTag) => {
                            // Update the tags with the new tag
                            this._tags.next([...tags, newTag]);

                            // Return new tag from observable
                            return newTag;
                        })
                    )
            )
        );
    }

    /**
     * Update the tag
     *
     * @param id
     * @param tag
     */
    updateTag(id: string, tag: ITag): Observable<ITag> {
        return this.tags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .patch<ITag>('api/apps/ecommerce/inventory/tag', {
                        id,
                        tag,
                    })
                    .pipe(
                        map((updatedTag) => {
                            // Find the index of the updated tag
                            const index = tags.findIndex(
                                (item) => item.id === id
                            );

                            // Update the tag
                            tags[index] = updatedTag;

                            // Update the tags
                            this._tags.next(tags);

                            // Return the updated tag
                            return updatedTag;
                        })
                    )
            )
        );
    }

    /**
     * Delete the tag
     *
     * @param id
     */
    deleteTag(id: string): Observable<boolean> {
        return this.tags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .delete('api/apps/ecommerce/inventory/tag', {
                        params: { id },
                    })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted tag
                            const index = tags.findIndex(
                                (item) => item.id === id
                            );

                            // Delete the tag
                            tags.splice(index, 1);

                            // Update the tags
                            this._tags.next(tags);

                            // Return the deleted status
                            return isDeleted;
                        }),
                        filter((isDeleted) => isDeleted),
                        switchMap((isDeleted) =>
                            this.users$.pipe(
                                take(1),
                                map((users) => {
                                    // Iterate through the contacts
                                    users.forEach((user) => {
                                        const tagIndex = user.tags.findIndex(
                                            (tag) => tag === id
                                        );

                                        // If the contact has the tag, remove it
                                        if (tagIndex > -1) {
                                            user.tags.splice(tagIndex, 1);
                                        }
                                    });

                                    // Return the deleted status
                                    return isDeleted;
                                })
                            )
                        )
                    )
            )
        );
    }
}
