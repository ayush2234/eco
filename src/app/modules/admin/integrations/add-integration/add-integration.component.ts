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
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PortalBridgeService } from 'app/layout/common/eco-drawer/portal-bridge.service';
import { Tag } from 'app/layout/common/grid/grid.types';
import { map, Subject, takeUntil } from 'rxjs';
import { CompanyService } from '../../companies/company.service';
import { SourceService } from '../../sources/source.service';
import { IntegrationService } from '../integration.service';
import { Integration } from '../integration.types';
@Component({
  selector: 'eco-admin-add-integration',
  templateUrl: './add-integration.component.html',
  styleUrls: ['./add-integration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationComponent implements OnInit, OnDestroy {
  @ViewChild(CdkPortal, { static: true })
  portalContent: CdkPortal;
  @Output() cancel = new EventEmitter();
  fuseDrawerOpened: boolean = true;
  selectedIntegration: Integration | null = null;
  selectedIntegrationForm: UntypedFormGroup;
  sourceTags: Tag[];
  filteredSourceTags: Tag[];
  restrictedToCompanyTags: Tag[];
  filteredRestrictedToCompanyTags: Tag[];
  flashMessage: 'success' | 'error' | null = null;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  errorMsg: string;
  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _portalBridge: PortalBridgeService,
    private _formBuilder: UntypedFormBuilder,
    private _integrationService: IntegrationService,
    private _sourceService: SourceService,
    private _companyService: CompanyService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._portalBridge.setPortal(this.portalContent);
    // Create the selected integration form
    this.selectedIntegrationForm = this._formBuilder.group({
      integration_id: [''],
      source_id: ['', Validators.required],
      restricted_to_companies: [[]],
      name: ['', Validators.required],
      icon: [''],
      description: [''],
      active_status: [false],
      is_beta: [false],
      is_custom: [false],
      force_test_connection: [false],
      channel_platform: [''],
      created_at: [''],
      notes: [''],
      updated_at: [''],
      installed_instances: [''],
    });

    // Set default value for integration
    this.selectedIntegration = this.selectedIntegrationForm.getRawValue();
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
   * Update the selected integration using the form data
   */
  createIntegration(): void {
    // Get the integration object
    const integration = this.selectedIntegrationForm.getRawValue();

    // Remove the currentImageIndex field
    delete integration.currentImageIndex;

    // Update the integration on the server
    this._integrationService.createIntegration(integration).subscribe(
      () => {
        // Show a success message
        // this.fuseDrawerOpened = false;
        this.showFlashMessage('success');
        if (this.flashMessage === 'success') {
          this.selectedIntegrationForm.reset();
        }
      },
      error => {
        // Show a error message
        this.showFlashMessage('error');
        if (error) {
          this.errorMsg = Object.values(error.error.errors).toString();
        } else {
          this.errorMsg = 'Something went wrong.Please try again';
        }
      }
    );
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
   * FuseDrawer openedChanged
   *
   */
  openedChanged(fuseDrawer): any {
    !fuseDrawer?.opened && this.cancel.emit();
  }

  /**
   * Cancel create integration
   *
   */
  onCancel(): any {
    this.fuseDrawerOpened = false;
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
