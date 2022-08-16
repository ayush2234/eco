import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
    debounceTime,
    map,
    merge,
    Observable,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { IPagination, ITag } from 'app/layout/common/types/grid.types';
import { Source } from '../source.types';
import { SourceService } from '../source.service';

@Component({
    selector: 'eco-sources-grid',
    templateUrl: './sources-grid.component.html',
    styles: [
        /* language=SCSS */
        `
            .sources-grid {
                grid-template-columns: repeat(3, 1fr);

                @screen sm {
                    grid-template-columns: repeat(3, 1fr) 72px;
                }

                @screen md {
                    grid-template-columns: repeat(5, 1fr) 72px;
                }

                @screen lg {
                    grid-template-columns: repeat(2, 2fr) 1fr 2fr repeat(3, 1fr) 72px;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class SourcesGridComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    sources$: Observable<Source[]>;

    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: IPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedSource: Source | null = null;
    selectedSourceForm: UntypedFormGroup;
    sourceTags: ITag[];
    filteredIntegrationTags: ITag[];
    restrictedToCompanyTags: ITag[];
    filteredRestrictedToCompanyTags: ITag[];
    sourceTagsEditMode: boolean = false;
    restrictedToCompanyTagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _sourceService: SourceService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the selected source form
        this.selectedSourceForm = this._formBuilder.group({
            sourceId: [''],
            restrictedToCompanies: [[]],
            integration: [[]],
            name: [''],
            icon: [''],
            description: [''],
            isBeta: [''],
            isCustom: [''],
            forceTestConnection: [''],
            jsonFormSchemaFile: [''],
            dateCreated: [''],
            notes: [''],
            dateUpdated: [''],
            installedInstances: [''],
        });

        // Get the pagination
        this._sourceService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: IPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the sources
        this.sources$ = this._sourceService.sources$;

        // Get the source tags
        this._sourceService.integrationTags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: ITag[]) => {
                // Update the tags
                this.sourceTags = tags;
                this.filteredIntegrationTags = tags;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the source tags
        this._sourceService.restrictedToCompanyTags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: ITag[]) => {
                // Update the tags
                this.restrictedToCompanyTags = tags;
                this.filteredRestrictedToCompanyTags = tags;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._sourceService.getSources(
                        0,
                        10,
                        'name',
                        'asc',
                        query
                    );
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the source changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get sources if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.closeDetails();
                        this.isLoading = true;
                        return this._sourceService.getSources(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            this._sort.active,
                            this._sort.direction
                        );
                    }),
                    map(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle source details
     *
     * @param sourceId
     */
    toggleDetails(sourceId: string): void {
        // If the source is already selected...
        if (this.selectedSource && this.selectedSource.sourceId === sourceId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the source by id
        this._sourceService.getSourceById(sourceId).subscribe((source) => {
            // Set the selected source
            this.selectedSource = source;

            // Fill the form
            this.selectedSourceForm.patchValue(source);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedSource = null;
    }

    /**
     * Toggle the tags edit mode
     */
    toggleIntegrationTagsEditMode(): void {
        this.sourceTagsEditMode = !this.sourceTagsEditMode;
    }

    /**
     * Toggle the tags edit mode
     */
    toggleRestrictedToCompanyTagsEditMode(): void {
        this.restrictedToCompanyTagsEditMode =
            !this.restrictedToCompanyTagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterIntegrationTags(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredIntegrationTags = this.sourceTags.filter((tag) =>
            tag.title.toLowerCase().includes(value)
        );
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterRestrictedToCompanyTags(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredRestrictedToCompanyTags =
            this.restrictedToCompanyTags.filter((tag) =>
                tag.title.toLowerCase().includes(value)
            );
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterIntegrationTagsInputKeyDown(event): void {
        // Return if the pressed key is not 'Enter'
        if (event.key !== 'Enter') {
            return;
        }

        // If there is no tag available...
        if (this.filterIntegrationTags.length === 0) {
            // Create the tag
            this.createIntegrationTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filterIntegrationTags[0];
        const isTagApplied = this.selectedSource.integration?.find(
            (id) => id === tag.id
        );

        // If the found tag is already applied to the source...
        if (isTagApplied) {
            // Remove the tag from the source
            this.removeIntegrationTagFromSource(tag);
        } else {
            // Otherwise add the tag to the source
            this.addIntegrationTagToSource(tag);
        }
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterRestrictedToCompanyTagsInputKeyDown(event): void {
        // Return if the pressed key is not 'Enter'
        if (event.key !== 'Enter') {
            return;
        }

        // If there is no tag available...
        if (this.filterRestrictedToCompanyTags.length === 0) {
            // Create the tag
            this.createRestrictedToCompanyTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filterRestrictedToCompanyTags[0];
        const isTagApplied = this.selectedSource.restrictedToCompanies?.find(
            (id) => id === tag.id
        );

        // If the found tag is already applied to the source...
        if (isTagApplied) {
            // Remove the tag from the source
            this.removeRestrictedToCompanyTagFromSource(tag);
        } else {
            // Otherwise add the tag to the source
            this.addRestrictedToCompanyTagToSource(tag);
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createIntegrationTag(title: string): void {
        const tag = {
            title,
        };

        // Create tag on the server
        this._sourceService.createIntegrationTag(tag).subscribe((response) => {
            // Add the tag to the source
            this.addIntegrationTagToSource(response);
        });
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createRestrictedToCompanyTag(title: string): void {
        const tag = {
            title,
        };

        // Create tag on the server
        this._sourceService
            .createRestrictedToCompanyTag(tag)
            .subscribe((response) => {
                // Add the tag to the source
                this.addRestrictedToCompanyTagToSource(response);
            });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateIntegrationTagTitle(tag: ITag, event): void {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._sourceService
            .updateIntegrationTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateRestrictedTagTitle(tag: ITag, event): void {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._sourceService
            .updateRestrictedToCompanyTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteIntegrationTag(tag: ITag): void {
        // Delete the tag from the server
        this._sourceService.deleteIntegrationTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteRestrictedToCompanyTag(tag: ITag): void {
        // Delete the tag from the server
        this._sourceService.deleteRestrictedToCompanyTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the source
     *
     * @param tag
     */
    addIntegrationTagToSource(tag: ITag): void {
        // Add the tag
        this.selectedSource.integration?.unshift(tag.id);

        // Update the selected source form
        this.selectedSourceForm
            .get('sourceId')
            .patchValue(this.selectedSource.sourceId);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the source
     *
     * @param tag
     */
    addRestrictedToCompanyTagToSource(tag: ITag): void {
        // Add the tag
        this.selectedSource.restrictedToCompanies?.unshift(tag.id);

        // Update the selected source form
        this.selectedSourceForm
            .get('restrictedToCompanies')
            .patchValue(this.selectedSource.restrictedToCompanies);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the source
     *
     * @param tag
     */
    removeIntegrationTagFromSource(tag: ITag): void {
        // Remove the tag
        this.selectedSource.integration?.splice(
            this.selectedSource.integration?.findIndex(
                (item) => item === tag.id
            ),
            1
        );

        // Update the selected source form
        this.selectedSourceForm
            .get('integration')
            .patchValue(this.selectedSource.integration);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the source
     *
     * @param tag
     */
    removeRestrictedToCompanyTagFromSource(tag: ITag): void {
        // Remove the tag
        this.selectedSource.restrictedToCompanies?.splice(
            this.selectedSource.restrictedToCompanies?.findIndex(
                (item) => item === tag.id
            ),
            1
        );

        // Update the selected source form
        this.selectedSourceForm
            .get('restrictedToCompanies')
            .patchValue(this.selectedSource.restrictedToCompanies);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle source tag
     *
     * @param tag
     * @param change
     */
    toggleIntegrationTag(tag: ITag, change: MatCheckboxChange): void {
        if (change.checked) {
            this.addIntegrationTagToSource(tag);
        } else {
            this.removeIntegrationTagFromSource(tag);
        }
    }

    /**
     * Toggle source tag
     *
     * @param tag
     * @param change
     */
    toggleRestricedToCompanyTag(tag: ITag, change: MatCheckboxChange): void {
        if (change.checked) {
            this.addRestrictedToCompanyTagToSource(tag);
        } else {
            this.removeRestrictedToCompanyTagFromSource(tag);
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateIntegrationTagButton(inputValue: string): boolean {
        return !!!(
            inputValue === '' ||
            this.sourceTags.findIndex(
                (tag) => tag.title.toLowerCase() === inputValue.toLowerCase()
            ) > -1
        );
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateRestrictedToCompanyTagButton(inputValue: string): boolean {
        return !!!(
            inputValue === '' ||
            this.restrictedToCompanyTags.findIndex(
                (tag) => tag.title.toLowerCase() === inputValue.toLowerCase()
            ) > -1
        );
    }

    /**
     * Create source
     */
    createSource(): void {
        // Create the source
        this._sourceService.createSource().subscribe((newsource) => {
            // Go to new source
            this.selectedSource = newsource;

            // Fill the form
            this.selectedSourceForm.patchValue(newsource);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Update the selected source using the form data
     */
    updateSelectedSource(): void {
        // Get the source object
        const source = this.selectedSourceForm.getRawValue();

        // Remove the currentImageIndex field
        delete source.currentImageIndex;

        // Update the source on the server
        this._sourceService.updateSource(source.id, source).subscribe(() => {
            // Show a success message
            this.showFlashMessage('success');
        });
    }

    /**
     * Delete the selected source using the form data
     */
    deleteSelectedSource(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete source',
            message:
                'Are you sure you want to remove this source? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the source object
                const source = this.selectedSourceForm.getRawValue();

                // Delete the source on the server
                this._sourceService.deleteSource(source.id).subscribe(() => {
                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
