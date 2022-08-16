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
import { Source } from './source.types';

@Injectable({
    providedIn: 'root',
})
export class SourceService {
    // Private
    private _source: BehaviorSubject<Source | null> = new BehaviorSubject(null);
    private _sources: BehaviorSubject<Source[] | null> = new BehaviorSubject(
        null
    );
    private _pagination: BehaviorSubject<IPagination | null> =
        new BehaviorSubject(null);
    private _integrationTags: BehaviorSubject<ITag[] | null> =
        new BehaviorSubject(null);
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
     * Setter & getter for source
     *
     * @param value
     */
    set source(value: Source) {
        // Store the value
        this._source.next(value);
    }

    get source$(): Observable<Source> {
        return this._source.asObservable();
    }

    /**
     * Getter for sources
     */
    get sources$(): Observable<Source[]> {
        return this._sources.asObservable();
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
    get integrationTags$(): Observable<ITag[]> {
        return this._integrationTags.asObservable();
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
     * Get sources
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getSources(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: IPagination;
        sources: Source[];
    }> {
        return this._httpClient
            .get<{
                pagination: IPagination;
                sources: Source[];
            }>('api/sources', {
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
                    this._sources.next(response.sources);
                })
            );
    }

    /**
     * Get the current logged in source data
     */
    get(): Observable<Source> {
        return this._httpClient.get<Source>('api/source').pipe(
            tap((source) => {
                this._source.next(source);
            })
        );
    }

    /**
     * Get source by id
     */
    getSourceById(id: string): Observable<Source> {
        return this._sources.pipe(
            take(1),
            map((sources) => {
                // Find the source
                const source =
                    sources.find((item) => item.sourceId === id) || null;

                // Update the source
                this._source.next(source);

                // Return the source
                return source;
            }),
            switchMap((source) => {
                if (!source) {
                    return throwError(
                        'Could not found source with id of ' + id + '!'
                    );
                }

                return of(source);
            })
        );
    }

    /**
     * Create source
     */
    createSource(): Observable<Source> {
        return this.sources$.pipe(
            take(1),
            switchMap((sources) =>
                this._httpClient.post<Source>('api/sources', {}).pipe(
                    map((newSource) => {
                        // Update the sources with the new source
                        this._sources.next([newSource, ...sources]);

                        // Return the new source
                        return newSource;
                    })
                )
            )
        );
    }

    /**
     * Update source
     *
     * @param id
     * @param source
     */
    updateSource(id: string, source: Source): Observable<Source> {
        return this.sources$.pipe(
            take(1),
            switchMap((sources) =>
                this._httpClient
                    .patch<Source>('api/sources', {
                        id,
                        source,
                    })
                    .pipe(
                        map((updatedSource) => {
                            // Find the index of the updated source
                            const index = sources.findIndex(
                                (item) => item.sourceId === id
                            );

                            // Update the source
                            sources[index] = updatedSource;

                            // Update the sources
                            this._sources.next(sources);

                            // Return the updated source
                            return updatedSource;
                        })
                    )
            )
        );
    }

    /**
     * Delete the source
     *
     * @param id
     */
    deleteSource(id: string): Observable<boolean> {
        return this.sources$.pipe(
            take(1),
            switchMap((sources) =>
                this._httpClient
                    .delete('api/sources', {
                        params: { id },
                    })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted source
                            const index = sources.findIndex(
                                (item) => item.sourceId === id
                            );

                            // Delete the source
                            sources.splice(index, 1);

                            // Update the sources
                            this._sources.next(sources);

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
    getIntegrationTags(): Observable<ITag[]> {
        return this._httpClient.get<ITag[]>('api/tags/integrations').pipe(
            tap((tags) => {
                this._integrationTags.next(tags);
            })
        );
    }

    /**
     * Create tag
     *
     * @param tag
     */
    createIntegrationTag(tag: ITag): Observable<ITag> {
        return this.integrationTags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .post<ITag>('api/tags/integrations', {
                        tag,
                    })
                    .pipe(
                        map((newTag) => {
                            // Update the tags with the new tag
                            this._integrationTags.next([...tags, newTag]);

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
    updateIntegrationTag(id: string, tag: ITag): Observable<ITag> {
        return this.integrationTags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .patch<ITag>('api/tags/integrations', {
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
                            this._integrationTags.next(tags);

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
    deleteIntegrationTag(id: string): Observable<boolean> {
        return this.integrationTags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .delete('api/tags/integrations', {
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
                            this._integrationTags.next(tags);

                            // Return the deleted status
                            return isDeleted;
                        }),
                        filter((isDeleted) => isDeleted),
                        switchMap((isDeleted) =>
                            this.sources$.pipe(
                                take(1),
                                map((sources) => {
                                    // Iterate through the contacts
                                    sources.forEach((source) => {
                                        const tagIndex =
                                            source.integration.findIndex(
                                                (tag) => tag === id
                                            );

                                        // If the contact has the tag, remove it
                                        if (tagIndex > -1) {
                                            source.integration.splice(
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
        return this.integrationTags$.pipe(
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
        return this.integrationTags$.pipe(
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
        return this.integrationTags$.pipe(
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
                            this.sources$.pipe(
                                take(1),
                                map((sources) => {
                                    // Iterate through the contacts
                                    sources.forEach((source) => {
                                        const tagIndex =
                                            source.restrictedToCompanies.findIndex(
                                                (tag) => tag === id
                                            );

                                        // If the contact has the tag, remove it
                                        if (tagIndex > -1) {
                                            source.restrictedToCompanies.splice(
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
