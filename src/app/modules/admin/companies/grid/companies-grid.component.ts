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
import { CompanyService } from '../company.service';
import { Pagination, Tag } from 'app/layout/common/grid/grid.types';
import { Company } from '../company.types';
import { IntegrationService } from '../../integrations/integration.service';
import { SourceService } from '../../sources/source.service';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';
import { Router } from '@angular/router';

@Component({
  selector: 'eco-companies-grid',
  templateUrl: './companies-grid.component.html',
  styles: [
    /* language=SCSS */
    `
      .companies-grid {
        grid-template-columns: repeat(5, 1fr);

        @screen sm {
          grid-template-columns: repeat(5, 1fr) 72px;
        }

        @screen md {
          grid-template-columns: repeat(9, 1fr) 72px;
        }

        @screen lg {
          grid-template-columns: 1fr 3fr repeat(7, 1fr) 72px;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class CompaniesGridComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  companies$: Observable<Company[]>;

  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  openAddCompany: boolean = false;
  pagination: Pagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedCompany: Company | null = null;
  selectedCompanyForm: UntypedFormGroup;
  restrictedToIntegrationTags: Tag[];
  filteredRestrictedToIntegrationTags: Tag[];
  restrictedToSourceTags: Tag[];
  filteredRestrictedToSourceTags: Tag[];
  errorMsg: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _companyService: CompanyService,
    private _integrationService: IntegrationService,
    private _sourceService: SourceService,
    private _router: Router
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the selected company form
    this.selectedCompanyForm = this._formBuilder.group({
      company_id: [''],
      company_name: ['', Validators.required],
      note: [''],
      referrer: [''],
      is_active: [''],
      allow_beta: [''],
      user_limit: ['', Validators.required],
      source_limit: ['', Validators.required],
      integration_limit: ['', Validators.required],
      sku_limit: ['', Validators.required],
      restricted_to_sources: [[]],
      restricted_to_integrations: [[]],
    });

    // Get the pagination
    this._companyService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: Pagination) => {
        // Update the pagination
        this.pagination = pagination;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Get the companies
    this.companies$ = this._companyService.companies$;

    // Get the integrations
    this._integrationService.integrations$
      .pipe(
        takeUntil(this._unsubscribeAll),
        map(integrations =>
          integrations.map(integration => {
            return {
              id: integration.integration_id,
              title: integration.name,
              source_id: integration.source_id,
            };
          })
        )
      )
      .subscribe((integrations: Tag[]) => {
        // Update the tags
        this.restrictedToIntegrationTags = integrations;
        this.filteredRestrictedToIntegrationTags = integrations;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

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
      .subscribe((integrations: Tag[]) => {
        // Update the tags
        this.restrictedToSourceTags = integrations;
        this.filteredRestrictedToSourceTags = integrations;

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
          return this._companyService.getCompanies(
            0,
            10,
            'company_name',
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
        id: 'company_name',
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

      // Get companys if sort or page changes
      merge(this._sort.sortChange, this._paginator.page)
        .pipe(
          switchMap(() => {
            this.closeDetails();
            this.isLoading = true;
            return this._companyService.getCompanies(
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
  //switch to login as
  switchRole(company: Company) {
    LocalStorageUtils.companyId = company.company_id;
    LocalStorageUtils.companyName = company.company_name;
    LocalStorageUtils.impersonate = 'true';
    this._router.navigate(['/user/dashboard/integration-status']);
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
   * Toggle company details
   *
   * @param companyId
   */
  toggleDetails(companyId: string): void {
    // If the company is already selected...
    if (this.selectedCompany && this.selectedCompany.company_id === companyId) {
      // Close the details
      this.closeDetails();
      return;
    }

    // Get the company by id
    this._companyService.getCompanyById(companyId).subscribe(company => {
      // Set the selected company
      this.selectedCompany = company;

      // Fill the form
      this.selectedCompanyForm.patchValue(company);

      this.filteredRestrictedToIntegrationTags =
        this.restrictedToIntegrationTags.filter(integration => {
          return this.selectedCompany.restricted_to_sources.includes(
            integration.source_id
          );
        });
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * Close the details
   */
  closeDetails(): void {
    this.selectedCompany = null;
  }

  /**
   * Filter tags
   *
   * @param event
   */
  filterRestrictedToIntegrationTags(event): void {
    // Get the value
    const value = event.target.value.toLowerCase();

    // Filter the tags
    this.filteredRestrictedToIntegrationTags =
      this.restrictedToIntegrationTags.filter(tag =>
        tag.title.toLowerCase().includes(value)
      );
  }

  /**
   * Filter tags
   *
   * @param event
   */
  filterRestrictedToSourceTags(event): void {
    // Get the value
    const value = event.target.value.toLowerCase();

    // Filter the tags
    this.filteredRestrictedToSourceTags = this.restrictedToSourceTags.filter(
      tag => tag.title.toLowerCase().includes(value)
    );
  }

  /**
   * Filter tags input key down event
   *
   * @param event
   */
  filterRestrictedToIntegrationTagsInputKeyDown(event): void {
    // Return if the pressed key is not 'Enter'
    if (event.key !== 'Enter') {
      return;
    }

    // If there is no tag available...
    if (this.filteredRestrictedToIntegrationTags.length === 0) {
      // Clear the input
      event.target.value = '';

      // Return
      return;
    }

    // If there is a tag...
    const tag = this.filteredRestrictedToIntegrationTags[0];
    const isTagApplied = this.selectedCompany.restricted_to_integrations.find(
      id => id === tag.id
    );

    // If the found tag is already applied to the company...
    if (isTagApplied) {
      // Remove the tag from the company
      this.removeRestrictedToIntegrationTagFromCompany(tag);
    } else {
      // Otherwise add the tag to the company
      this.addRestrictedToIntegrationTagToCompany(tag);
    }
  }

  /**
   * Filter tags input key down event
   *
   * @param event
   */
  filterRestrictedToSourceTagsInputKeyDown(event): void {
    // Return if the pressed key is not 'Enter'
    if (event.key !== 'Enter') {
      return;
    }

    // If there is no tag available...
    if (this.filteredRestrictedToSourceTags.length === 0) {
      // Clear the input
      event.target.value = '';

      // Return
      return;
    }

    // If there is a tag...
    const tag = this.filteredRestrictedToSourceTags[0];
    const isTagApplied = this.selectedCompany.restricted_to_sources.find(
      id => id === tag.id
    );

    // If the found tag is already applied to the company...
    if (isTagApplied) {
      // Remove the tag from the company
      this.removeRestrictedToSourceTagFromCompany(tag);
    } else {
      // Otherwise add the tag to the company
      this.addRestrictedToSourceTagToCompany(tag);
    }
  }

  /**
   * Add tag to the company
   *
   * @param tag
   */
  addRestrictedToIntegrationTagToCompany(tag: Tag): void {
    // Add the tag
    this.selectedCompany.restricted_to_integrations.unshift(tag.id);

    // Update the selected company form
    this.selectedCompanyForm
      .get('restricted_to_integrations')
      .patchValue(this.selectedCompany.restricted_to_integrations);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Remove tag from the company
   *
   * @param tag
   */
  removeRestrictedToIntegrationTagFromCompany(tag: Tag): void {
    // Remove the tag

    this.selectedCompany.restricted_to_integrations.splice(
      this.selectedCompany.restricted_to_integrations.findIndex(
        item => item === tag.id
      ),
      1
    );

    // Update the selected company form
    this.selectedCompanyForm
      .get('restricted_to_integrations')
      .patchValue(this.selectedCompany.restricted_to_integrations);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Add tag to the company
   *
   * @param tag
   */
  addRestrictedToSourceTagToCompany(tag: Tag): void {
    // Add the tag
    this.selectedCompany.restricted_to_sources.unshift(tag.id);

    // Update the selected company form
    this.selectedCompanyForm
      .get('restricted_to_sources')
      .patchValue(this.selectedCompany.restricted_to_sources);

    //updated integration tags based on source id

    this.filteredRestrictedToIntegrationTags =
      this.restrictedToIntegrationTags.filter(integration => {
        return this.selectedCompany.restricted_to_sources.includes(
          integration.source_id
        );
      });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Remove tag from the company
   *
   * @param tag
   */
  removeRestrictedToSourceTagFromCompany(tag: Tag): void {
    // Remove the tag
    this.selectedCompany.restricted_to_sources.splice(
      this.selectedCompany.restricted_to_sources.findIndex(
        item => item === tag.id
      ),
      1
    );

    // Update the selected company form
    this.selectedCompanyForm
      .get('restricted_to_sources')
      .patchValue(this.selectedCompany.restricted_to_sources);

    //updated integration tags based on source id

    this.filteredRestrictedToIntegrationTags =
      this.restrictedToIntegrationTags.filter(it => {
        return this.selectedCompany.restricted_to_sources.includes(
          it.source_id
        );
      });

    if (this.selectedCompany.restricted_to_sources.length === 0) {
      this.selectedCompany.restricted_to_integrations.splice(
        0,
        this.selectedCompany.restricted_to_integrations.length
      );
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Toggle company tag
   *
   * @param tag
   * @param change
   */
  toggleRestrictedToIntegrationTag(tag: Tag, change: MatCheckboxChange): void {
    if (change.checked) {
      this.addRestrictedToIntegrationTagToCompany(tag);
    } else {
      this.removeRestrictedToIntegrationTagFromCompany(tag);
    }
  }

  /**
   * Toggle company tag
   *
   * @param tag
   * @param change
   */
  toggleRestrictedToSourceTag(tag: Tag, change: MatCheckboxChange): void {
    if (change.checked) {
      this.addRestrictedToSourceTagToCompany(tag);
    } else {
      this.removeRestrictedToSourceTagFromCompany(tag);
    }
  }

  /**
   * Create company
   */
  createCompany(): void {
    this.openAddCompany = true;
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Cancel create source
   */
  cancelCreateCompany(): void {
    this.openAddCompany = false;
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Update the selected company using the form data
   */
  updateSelectedCompany(): void {
    // Get the company object
    const company = this.selectedCompanyForm.getRawValue();

    // Remove the currentImageIndex field
    delete company.currentImageIndex;

    // Update the company on the server
    this._companyService.updateCompany(company.company_id, company).subscribe(
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
   * Delete the selected company using the form data
   */
  deleteSelectedCompany(): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete company',
      message:
        'Are you sure you want to remove this company? This action cannot be undone!',
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
        // Get the company object
        const company = this.selectedCompanyForm.getRawValue();

        // Delete the company on the server
        this._companyService.deleteCompany(company.company_id).subscribe(() => {
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
    }, 5000);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item?.id || index;
  }
}
