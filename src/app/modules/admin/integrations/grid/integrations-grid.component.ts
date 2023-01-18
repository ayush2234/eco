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
import { Integration } from '../integration.types';
import { IntegrationService } from '../integration.service';
import { SourceService } from '../../sources/source.service';
import { CompanyService } from '../../companies/company.service';

@Component({
  selector: 'eco-integrations-grid',
  templateUrl: './integrations-grid.component.html',
  styles: [
    /* language=SCSS */
    `
      .integrations-grid {
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
export class IntegrationsGridComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  integrations$: Observable<Integration[]>;

  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  openAddIntegration: boolean = false;
  pagination: Pagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedIntegration: Integration | null = null;
  selectedIntegrationForm: UntypedFormGroup;
  sourceTags: Tag[];
  filteredSourceTags: Tag[];
  restrictedToCompanyTags: Tag[];
  filteredRestrictedToCompanyTags: Tag[];
  errorMsg: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _integrationService: IntegrationService,
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
    // Create the selected integration form
    this.selectedIntegrationForm = this._formBuilder.group({
      integration_id: [''],
      source_id: [[]],
      restricted_to_companies: [[]],
      name: ['', Validators.required],
      icon: [''],
      description: [''],
      active_status: [''],
      is_beta: [''],
      is_custom: [''],
      force_test_connection: [''],
      channel_platform: [''],
      created_at: [''],
      notes: [''],
      updated_at: [''],
      installed_instances: [''],
    });

    // Get the pagination
    this._integrationService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: Pagination) => {
        // Update the pagination
        this.pagination = pagination;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Get the integrations
    this.integrations$ = this._integrationService.integrations$;

    // Get the sources
    this._sourceService.sources$
      .pipe(
        takeUntil(this._unsubscribeAll),
        map(sources =>
          sources?.map(source => {
            return { id: source.source_id, title: source.name };
          })
        )
      )
      .subscribe((sources: Tag[]) => {
        // Update the tags
        this.sourceTags = sources;
        this.filteredSourceTags = sources;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

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
          return this._integrationService.getIntegrations(
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

      // If the integration changes the sort order...
      this._sort.sortChange
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          // Reset back to the first page
          this._paginator.pageIndex = 0;

          // Close the details
          this.closeDetails();
        });

      // Get integrations if sort or page changes
      merge(this._sort.sortChange, this._paginator.page)
        .pipe(
          switchMap(() => {
            this.closeDetails();
            this.isLoading = true;
            return this._integrationService.getIntegrations(
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
   * Toggle integration details
   *
   * @param integrationId
   */
  toggleDetails(integrationId: string): void {
    // If the integration is already selected...
    if (
      this.selectedIntegration &&
      this.selectedIntegration.integration_id === integrationId
    ) {
      // Close the details
      this.closeDetails();
      return;
    }

    // Get the integration by id
    this._integrationService
      .getIntegrationById(integrationId)
      .subscribe(integration => {
        // Set the selected integration
        this.selectedIntegration = integration;

        // Fill the form
        this.selectedIntegrationForm.patchValue(integration);

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * Close the details
   */
  closeDetails(): void {
    this.selectedIntegration = null;
  }

  /**
   * Filter tags
   *
   * @param event
   */
  filterSourceTags(event): void {
    // Get the value
    const value = event.target.value.toLowerCase();

    // Filter the tags
    this.filteredSourceTags = this.sourceTags.filter(tag =>
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
    this.filteredRestrictedToCompanyTags = this.restrictedToCompanyTags.filter(
      tag => tag.title.toLowerCase().includes(value)
    );
  }

  /**
   * Filter tags input key down event
   *
   * @param event
   */
  filterSourceTagsInputKeyDown(event): void {
    // Return if the pressed key is not 'Enter'
    if (event.key !== 'Enter') {
      return;
    }

    // If there is no tag available...
    if (this.filterSourceTags.length === 0) {
      // Clear the input
      event.target.value = '';

      // Return
      return;
    }

    // If there is a tag...
    const tag = this.filterSourceTags[0];
    const isTagApplied = this.selectedIntegration.source_id === tag.id;

    // If the found tag is already applied to the integration...
    if (isTagApplied) {
      // Remove the tag from the integration
      this.removeSourceTagFromIntegration(tag);
    } else {
      // Otherwise add the tag to the integration
      this.addSourceTagToIntegration(tag);
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
      // Clear the input
      event.target.value = '';

      // Return
      return;
    }

    // If there is a tag...
    const tag = this.filterRestrictedToCompanyTags[0];
    const isTagApplied = this.selectedIntegration.restricted_to_companies?.find(
      id => id === tag.id
    );

    // If the found tag is already applied to the integration...
    if (isTagApplied) {
      // Remove the tag from the integration
      this.removeRestrictedToCompanyTagFromIntegration(tag);
    } else {
      // Otherwise add the tag to the integration
      this.addRestrictedToCompanyTagToIntegration(tag);
    }
  }

  /**
   * Add tag to the integration
   *
   * @param tag
   */
  addSourceTagToIntegration(tag: Tag): void {
    // Add the tag
    this.selectedIntegration.source_id = tag.id;

    // Update the selected integration form
    this.selectedIntegrationForm
      .get('source_id')
      .patchValue(this.selectedIntegration.source_id);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Add tag to the integration
   *
   * @param tag
   */
  addRestrictedToCompanyTagToIntegration(tag: Tag): void {
    // Add the tag
    this.selectedIntegration.restricted_to_companies?.unshift(tag.id);

    // Update the selected integration form
    this.selectedIntegrationForm
      .get('restricted_to_companies')
      .patchValue(this.selectedIntegration.restricted_to_companies);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Remove tag from the integration
   *
   * @param tag
   */
  removeSourceTagFromIntegration(tag: Tag): void {
    // Remove the tag
    this.selectedIntegration.source_id = null;

    // Update the selected integration form
    this.selectedIntegrationForm
      .get('source_id')
      .patchValue(this.selectedIntegration.source_id);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Remove tag from the integration
   *
   * @param tag
   */
  removeRestrictedToCompanyTagFromIntegration(tag: Tag): void {
    // Remove the tag
    this.selectedIntegration.restricted_to_companies?.splice(
      this.selectedIntegration.restricted_to_companies?.findIndex(
        item => item === tag.id
      ),
      1
    );

    // Update the selected integration form
    this.selectedIntegrationForm
      .get('restricted_to_companies')
      .patchValue(this.selectedIntegration.restricted_to_companies);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Toggle integration tag
   *
   * @param tag
   * @param change
   */
  toggleSourceTag(tag: Tag, change: MatCheckboxChange): void {
    if (change.checked) {
      this.addSourceTagToIntegration(tag);
    } else {
      this.removeSourceTagFromIntegration(tag);
    }
  }

  /**
   * Toggle integration tag
   *
   * @param tag
   * @param change
   */
  toggleRestricedToCompanyTag(tag: Tag, change: MatCheckboxChange): void {
    if (change.checked) {
      this.addRestrictedToCompanyTagToIntegration(tag);
    } else {
      this.removeRestrictedToCompanyTagFromIntegration(tag);
    }
  }

  /**
   * Create source
   */
  createIntegration(): void {
    this.openAddIntegration = true;
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Cancel create source
   */
  cancelCreateIntegration(): void {
    this.openAddIntegration = false;
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Update the selected integration using the form data
   */
  updateSelectedIntegration(): void {
    // Get the integration object
    const integration = this.selectedIntegrationForm.getRawValue();

    // Update the integration on the server
    this._integrationService
      .updateIntegration(integration.integration_id, integration)
      .subscribe(
        () => {
          this.closeDetails();
          // Show a success message
          this.showFlashMessage('success');
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
   * Delete the selected integration using the form data
   */
  deleteSelectedIntegration(): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete integration',
      message:
        'Are you sure you want to remove this integration? This action cannot be undone!',
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
        // Get the integration object
        const integration = this.selectedIntegrationForm.getRawValue();

        // Delete the integration on the server
        this._integrationService
          .deleteIntegration(integration.integration_id)
          .subscribe(() => {
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
