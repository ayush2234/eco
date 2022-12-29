import { CdkPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PortalBridgeService } from 'app/layout/common/eco-drawer/portal-bridge.service';
import { Tag } from 'app/layout/common/grid/grid.types';
import { map, Subject, takeUntil } from 'rxjs';
import { IntegrationService } from '../../integrations/integration.service';
import { SourceService } from '../../sources/source.service';
import { CompanyService } from '../company.service';
import { Company } from '../company.types';

@Component({
  selector: 'eco-admin-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCompanyComponent implements OnInit, OnDestroy {
  @ViewChild(CdkPortal, { static: true })
  portalContent: CdkPortal;
  errorMsg: string;
  @Output() cancel = new EventEmitter();
  fuseDrawerOpened: boolean = true;
  flashMessage: 'success' | 'error' | null = null;
  selectedCompany: Company | null = null;
  selectedCompanyForm: UntypedFormGroup;
  restrictedToIntegrationTags: Tag[];
  filteredRestrictedToIntegrationTags: Tag[];
  restrictedToSourceTags: Tag[];
  filteredRestrictedToSourceTags: Tag[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _portalBridge: PortalBridgeService,
    private _formBuilder: UntypedFormBuilder,
    private _companyService: CompanyService,
    private _integrationService: IntegrationService,
    private _sourceService: SourceService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._portalBridge.setPortal(this.portalContent);
    // Create the selected company form
    this.selectedCompanyForm = this._formBuilder.group({
      company_id: [''],
      company_name: ['', [Validators.required]],
      note: [''],
      referrer: [''],
      is_active: [false],
      allow_beta: [false],
      user_limit: ['', [Validators.required]],
      source_limit: [0, [Validators.required]],
      integration_limit: ['', [Validators.required]],
      sku_limit: ['', [Validators.required]],
      restricted_to_sources: [[]],
      restricted_to_integrations: [[]],
    });

    // Set default value for source
    this.selectedCompany = this.selectedCompanyForm.getRawValue();

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
          sources.map(source => {
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
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    //to close the side drawer for backdrop
    this.fuseDrawerOpened = false;
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this.portalContent.detach();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Update the selected company using the form data
   */
  createCompany(): void {
    // Get the company object
    const company = this.selectedCompanyForm.getRawValue();

    // Remove the currentImageIndex field
    delete company.currentImageIndex;

    // Update the company on the server
    this._companyService.createCompany(company).subscribe(
      () => {
        // Show a success message

        // this.fuseDrawerOpened = false;
        this.showFlashMessage('success');
        if (this.flashMessage === 'success') {
          this.selectedCompanyForm.reset();
        }
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
      this.filteredRestrictedToIntegrationTags =
        this.restrictedToIntegrationTags;
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
   * FuseDrawer openedChanged
   *
   */
  openedChanged(fuseDrawer): any {
    !fuseDrawer?.opened && this.cancel.emit();
  }

  /**
   * Cancel create company
   *
   */
  onCancel(): any {
    this.fuseDrawerOpened = false;
  }
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
    return item.id || index;
  }
}
