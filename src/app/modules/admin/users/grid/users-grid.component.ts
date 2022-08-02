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
    FormControl,
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
import { UsersService } from '../users.service';
import { User } from '../users.types';
import { IPagination, ITag } from 'app/layout/common/types/grid.types';

@Component({
    selector: 'eco-users-grid',
    templateUrl: './users-grid.component.html',
    styles: [
        /* language=SCSS */
        `
            .users-grid {
                grid-template-columns: repeat(3, 1fr);

                @screen sm {
                    grid-template-columns: repeat(3, 1fr) 72px;
                }

                @screen md {
                    grid-template-columns: repeat(5, 1fr) 72px;
                }

                @screen lg {
                    grid-template-columns: 1fr 3fr repeat(2, 1fr) 72px;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class UsersGridComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    users$: Observable<User[]>;

    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: IPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedUser: User | null = null;
    selectedUserForm: UntypedFormGroup;
    tags: ITag[];
    filteredTags: ITag[];
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _userService: UsersService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the selected user form
        this.selectedUserForm = this._formBuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            email: [''],
            password: [''],
            role: [''],
            active: [''],
            notes: [''],
            tags: [[]],
        });

        // Get the pagination
        this._userService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: IPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the users
        this.users$ = this._userService.users$;

        // Get the tags
        this._userService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: ITag[]) => {
                // Update the tags
                this.tags = tags;
                this.filteredTags = tags;

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
                    return this._userService.getUsers(
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

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get users if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.closeDetails();
                        this.isLoading = true;
                        return this._userService.getUsers(
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
     * Toggle user details
     *
     * @param userId
     */
    toggleDetails(userId: string): void {
        // If the user is already selected...
        if (this.selectedUser && this.selectedUser.id === userId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the user by id
        this._userService.getUserById(userId).subscribe((user) => {
            // Set the selected user
            this.selectedUser = user;

            // Fill the form
            this.selectedUserForm.patchValue(user);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedUser = null;
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags = this.tags.filter((tag) =>
            tag.title.toLowerCase().includes(value)
        );
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void {
        // Return if the pressed key is not 'Enter'
        if (event.key !== 'Enter') {
            return;
        }

        // If there is no tag available...
        if (this.filteredTags.length === 0) {
            // Create the tag
            this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filteredTags[0];
        const isTagApplied = this.selectedUser.tags.find((id) => id === tag.id);

        // If the found tag is already applied to the user...
        if (isTagApplied) {
            // Remove the tag from the user
            this.removeTagFromUser(tag);
        } else {
            // Otherwise add the tag to the user
            this.addTagToUser(tag);
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void {
        const tag = {
            title,
        };

        // Create tag on the server
        this._userService.createTag(tag).subscribe((response) => {
            // Add the tag to the user
            this.addTagToUser(response);
        });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: ITag, event): void {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._userService
            .updateTag(tag.id, tag)
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
    deleteTag(tag: ITag): void {
        // Delete the tag from the server
        this._userService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the user
     *
     * @param tag
     */
    addTagToUser(tag: ITag): void {
        // Add the tag
        this.selectedUser.tags.unshift(tag.id);

        // Update the selected user form
        this.selectedUserForm.get('tags').patchValue(this.selectedUser.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the user
     *
     * @param tag
     */
    removeTagFromUser(tag: ITag): void {
        // Remove the tag
        this.selectedUser.tags.splice(
            this.selectedUser.tags.findIndex((item) => item === tag.id),
            1
        );

        // Update the selected user form
        this.selectedUserForm.get('tags').patchValue(this.selectedUser.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle user tag
     *
     * @param tag
     * @param change
     */
    toggleITag(tag: ITag, change: MatCheckboxChange): void {
        if (change.checked) {
            this.addTagToUser(tag);
        } else {
            this.removeTagFromUser(tag);
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean {
        return !!!(
            inputValue === '' ||
            this.tags.findIndex(
                (tag) => tag.title.toLowerCase() === inputValue.toLowerCase()
            ) > -1
        );
    }

    /**
     * Create user
     */
    createUser(): void {
        // Create the user
        this._userService.createUser().subscribe((newuser) => {
            // Go to new user
            this.selectedUser = newuser;

            // Fill the form
            this.selectedUserForm.patchValue(newuser);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Update the selected user using the form data
     */
    updateSelectedUser(): void {
        // Get the user object
        const user = this.selectedUserForm.getRawValue();

        // Remove the currentImageIndex field
        delete user.currentImageIndex;

        // Update the user on the server
        this._userService.updateUser(user.id, user).subscribe(() => {
            // Show a success message
            this.showFlashMessage('success');
        });
    }

    /**
     * Delete the selected user using the form data
     */
    deleteSelectedUser(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete user',
            message:
                'Are you sure you want to remove this user? This action cannot be undone!',
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
                // Get the user object
                const user = this.selectedUserForm.getRawValue();

                // Delete the user on the server
                this._userService.deleteUser(user.id).subscribe(() => {
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
