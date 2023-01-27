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
import { Pagination, Tag } from 'app/layout/common/grid/grid.types';
import { Source } from '../source.types';
import { SourceService } from '../source.service';
import { CompanyService } from '../../companies/company.service';

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
          grid-template-columns: repeat(2, 2fr) 1fr repeat(3, 1fr) 72px;
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
  openAddSource: boolean = false;
  pagination: Pagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedSource: Source | null = null;
  selectedSourceForm: UntypedFormGroup;
  restrictedToCompanyTags: Tag[];
  filteredRestrictedToCompanyTags: Tag[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  errorMsg: string;
  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _sourceService: SourceService,
    private _companyService: CompanyService
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
      source_id: [''],
      name: ['', Validators.required],
      icon: [''],
      description: [''],
      active_status: [''],
      is_beta: [''],
      is_custom: [''],
      force_connection_test: [''],
      need_auth: [''],
      source_platform: ['', Validators.required],
      dateCreated: [''],
      dateUpdated: [''],
      installedInstances: [''],
      restricted_to_companies: [[]],
    });

    // Get the pagination
    this._sourceService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: Pagination) => {
        // Update the pagination
        this.pagination = pagination;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Get the sources
    this.sources$ = this._sourceService.sources$;

    // Get the companies
    this._companyService.companies$
      .pipe(
        takeUntil(this._unsubscribeAll),
        map(companies =>
          companies.map(company => {
            return { id: company.company_id, title: company.company_name };
          })
        )
      )
      .subscribe((companies: Tag[]) => {
        // Update the tags
        this.restrictedToCompanyTags = companies;
        this.filteredRestrictedToCompanyTags = companies;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Subscribe to search input field value changes
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap(query => {
          this.closeDetails();
          this.isLoading = true;
          return this._sourceService.getSources(0, 10, 'name', 'asc', query);
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
    if (this.selectedSource && this.selectedSource.source_id === sourceId) {
      // Close the details
      this.closeDetails();
      return;
    }

    // Get the source by id
    this._sourceService.getSourceById(sourceId).subscribe(source => {
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
   * Filter tags
   *
   * @param event
   */
  filterRestrictedToCompanyTags(event): void {
    // Get the value
    const value = event.target.value.toLowerCase();

    // Filter the tags
    this.filteredRestrictedToCompanyTags = this.restrictedToCompanyTags.filter(
      tag => tag.title.toLowerCase().includes(value)
    );
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
      // Clear the input
      event.target.value = '';

      // Return
      return;
    }

    // If there is a tag...
    const tag = this.filterRestrictedToCompanyTags[0];
    const isTagApplied = this.selectedSource.restricted_to_companies?.find(
      id => id === tag.id
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
   * Add tag to the source
   *
   * @param tag
   */
  addRestrictedToCompanyTagToSource(tag: Tag): void {
    // Add the tag
    this.selectedSource.restricted_to_companies?.unshift(tag.id);

    // Update the selected source form
    this.selectedSourceForm
      .get('restricted_to_companies')
      .patchValue(this.selectedSource.restricted_to_companies);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Remove tag from the source
   *
   * @param tag
   */
  removeRestrictedToCompanyTagFromSource(tag: Tag): void {
    // Remove the tag
    this.selectedSource.restricted_to_companies?.splice(
      this.selectedSource.restricted_to_companies?.findIndex(
        item => item === tag.id
      ),
      1
    );

    // Update the selected source form
    this.selectedSourceForm
      .get('restricted_to_companies')
      .patchValue(this.selectedSource.restricted_to_companies);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Toggle tag
   *
   * @param tag
   * @param change
   */
  toggleRestricedToCompanyTag(tag: Tag, change: MatCheckboxChange): void {
    if (change.checked) {
      this.addRestrictedToCompanyTagToSource(tag);
    } else {
      this.removeRestrictedToCompanyTagFromSource(tag);
    }
  }

  /**
   * Create source
   */
  createSource(): void {
    this.openAddSource = true;
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Cancel create source
   */
  cancelCreateSource(): void {
    this.openAddSource = false;
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Update the selected source using the form data
   */
  updateSelectedSource(): void {
    // Get the source object
    const source = this.selectedSourceForm.getRawValue();

    // Update the source on the server
    this._sourceService.updateSource(source.source_id, source).subscribe(
      () => {
        this.closeDetails();
        // Show a success message
        this.showFlashMessage('success');
        this.closeDetails();
      },
      error => {
        this.showFlashMessage('error');
        if (error) {
          this.errorMsg = Object.values(error.error.errors).toString();
        } else {
          this.errorMsg = 'Something went wrong.Please try again';
        }
      }
    );
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
    confirmation.afterClosed().subscribe(result => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Get the source object
        const source = this.selectedSourceForm.getRawValue();

        // Delete the source on the server
        this._sourceService.deleteSource(source.source_id).subscribe(() => {
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
