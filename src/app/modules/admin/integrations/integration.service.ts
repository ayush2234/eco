/* eslint-disable @typescript-eslint/member-ordering */
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
import { IPagination, ITag } from 'app/layout/common/types/grid.types';
import { Integration } from './integration.types';

@Injectable({
    providedIn: 'root',
})
export class IntegrationService {
    // Private
    private _integration: BehaviorSubject<Integration | null> =
        new BehaviorSubject(null);
    private _integrations: BehaviorSubject<Integration[] | null> =
        new BehaviorSubject(null);
    private _pagination: BehaviorSubject<IPagination | null> =
        new BehaviorSubject(null);
    private _sourceTags: BehaviorSubject<ITag[] | null> = new BehaviorSubject(
        null
    );
    private _restrictedToCompanyTags: BehaviorSubject<ITag[] | null> =
        new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for integration
     *
     * @param value
     */
    set integration(value: Integration) {
        // Store the value
        this._integration.next(value);
    }

    get integration$(): Observable<Integration> {
        return this._integration.asObservable();
    }

    /**
     * Getter for integrations
     */
    get integrations$(): Observable<Integration[]> {
        return this._integrations.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<IPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for source tags
     */
    get sourceTags$(): Observable<ITag[]> {
        return this._sourceTags.asObservable();
    }

    /**
     * Getter for restricted company tags
     */
    get restrictedToCompanyTags$(): Observable<ITag[]> {
        return this._restrictedToCompanyTags.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get integrations
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getIntegrations(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: IPagination;
        integrations: Integration[];
    }> {
        return this._httpClient
            .get<{
                pagination: IPagination;
                integrations: Integration[];
            }>('api/integrations', {
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
                    this._integrations.next(response.integrations);
                })
            );
    }

    /**
     * Get the current logged in integration data
     */
    get(): Observable<Integration> {
        return this._httpClient.get<Integration>('api/integration').pipe(
            tap((integration) => {
                this._integration.next(integration);
            })
        );
    }

    /**
     * Get integration by id
     */
    getIntegrationById(id: string): Observable<Integration> {
        return this._integrations.pipe(
            take(1),
            map((integrations) => {
                // Find the integration
                const integration =
                    integrations.find((item) => item.integrationId === id) ||
                    null;

                // Update the integration
                this._integration.next(integration);

                // Return the integration
                return integration;
            }),
            switchMap((integration) => {
                if (!integration) {
                    return throwError(
                        'Could not found integration with id of ' + id + '!'
                    );
                }

                return of(integration);
            })
        );
    }

    /**
     * Create integration
     */
    createIntegration(): Observable<Integration> {
        return this.integrations$.pipe(
            take(1),
            switchMap((integrations) =>
                this._httpClient.post<Integration>('api/integrations', {}).pipe(
                    map((newIntegration) => {
                        // Update the integrations with the new integration
                        this._integrations.next([
                            newIntegration,
                            ...integrations,
                        ]);

                        // Return the new integration
                        return newIntegration;
                    })
                )
            )
        );
    }

    /**
     * Update integration
     *
     * @param id
     * @param integration
     */
    updateIntegration(
        id: string,
        integration: Integration
    ): Observable<Integration> {
        return this.integrations$.pipe(
            take(1),
            switchMap((integrations) =>
                this._httpClient
                    .patch<Integration>('api/integrations', {
                        id,
                        integration,
                    })
                    .pipe(
                        map((updatedIntegration) => {
                            // Find the index of the updated integration
                            const index = integrations.findIndex(
                                (item) => item.integrationId === id
                            );

                            // Update the integration
                            integrations[index] = updatedIntegration;

                            // Update the integrations
                            this._integrations.next(integrations);

                            // Return the updated integration
                            return updatedIntegration;
                        })
                    )
            )
        );
    }

    /**
     * Delete the integration
     *
     * @param id
     */
    deleteIntegration(id: string): Observable<boolean> {
        return this.integrations$.pipe(
            take(1),
            switchMap((integrations) =>
                this._httpClient
                    .delete('api/integrations', {
                        params: { id },
                    })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted integration
                            const index = integrations.findIndex(
                                (item) => item.integrationId === id
                            );

                            // Delete the integration
                            integrations.splice(index, 1);

                            // Update the integrations
                            this._integrations.next(integrations);

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
    getSourceTags(): Observable<ITag[]> {
        return this._httpClient.get<ITag[]>('api/tags/sources').pipe(
            tap((tags) => {
                this._sourceTags.next(tags);
            })
        );
    }

    /**
     * Create tag
     *
     * @param tag
     */
    createSourceTag(tag: ITag): Observable<ITag> {
        return this.sourceTags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .post<ITag>('api/tags/sources', {
                        tag,
                    })
                    .pipe(
                        map((newTag) => {
                            // Update the tags with the new tag
                            this._sourceTags.next([...tags, newTag]);

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
    updateSourceTag(id: string, tag: ITag): Observable<ITag> {
        return this.sourceTags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .patch<ITag>('api/source', {
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
                            this._sourceTags.next(tags);

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
    deleteSourceTag(id: string): Observable<boolean> {
        return this.sourceTags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .delete('api/tags/sources', {
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
                            this._sourceTags.next(tags);

                            // Return the deleted status
                            return isDeleted;
                        }),
                        filter((isDeleted) => isDeleted),
                        switchMap((isDeleted) =>
                            this.integrations$.pipe(
                                take(1),
                                map((integrations) => {
                                    // Iterate through the contacts
                                    integrations.forEach((integration) => {
                                        const tagIndex =
                                            integration.sourceId.findIndex(
                                                (tag) => tag === id
                                            );

                                        // If the contact has the tag, remove it
                                        if (tagIndex > -1) {
                                            integration.sourceId.splice(
                                                tagIndex,
                                                1
                                            );
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

    /**
     * Get tags
     */
    getRestrictedToCompanyTags(): Observable<ITag[]> {
        return this._httpClient
            .get<ITag[]>('api/tags/restricted-companies')
            .pipe(
                tap((tags) => {
                    this._restrictedToCompanyTags.next(tags);
                })
            );
    }

    /**
     * Create tag
     *
     * @param tag
     */
    createRestrictedToCompanyTag(tag: ITag): Observable<ITag> {
        return this.sourceTags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .post<ITag>('api/tags/restricted-companies', {
                        tag,
                    })
                    .pipe(
                        map((newTag) => {
                            // Update the tags with the new tag
                            this._restrictedToCompanyTags.next([
                                ...tags,
                                newTag,
                            ]);

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
    updateRestrictedToCompanyTag(id: string, tag: ITag): Observable<ITag> {
        return this.sourceTags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .patch<ITag>('api/tags/restricted-companies', {
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
                            this._restrictedToCompanyTags.next(tags);

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
    deleteRestrictedToCompanyTag(id: string): Observable<boolean> {
        return this.sourceTags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .delete('api/tags/restricted-companies', {
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
                            this._restrictedToCompanyTags.next(tags);

                            // Return the deleted status
                            return isDeleted;
                        }),
                        filter((isDeleted) => isDeleted),
                        switchMap((isDeleted) =>
                            this.integrations$.pipe(
                                take(1),
                                map((integrations) => {
                                    // Iterate through the contacts
                                    integrations.forEach((integration) => {
                                        const tagIndex =
                                            integration.restrictedToCompanies.findIndex(
                                                (tag) => tag === id
                                            );

                                        // If the contact has the tag, remove it
                                        if (tagIndex > -1) {
                                            integration.sourceId.splice(
                                                tagIndex,
                                                1
                                            );
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
