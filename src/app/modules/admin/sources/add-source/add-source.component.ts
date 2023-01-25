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
import { CompanyService } from '../../companies/company.service';
import { SourceService } from '../source.service';
import { Source } from '../source.types';

@Component({
  selector: 'eco-admin-add-source',
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSourceComponent implements OnInit, OnDestroy {
  @ViewChild(CdkPortal, { static: true })
  portalContent: CdkPortal;
  @Output() cancel = new EventEmitter();
  fuseDrawerOpened: boolean = true;
  selectedSource: Source | null = null;
  selectedSourceForm: UntypedFormGroup;
  restrictedToCompanyTags: Tag[];
  filteredRestrictedToCompanyTags: Tag[];
  errorMsg: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  flashMessage: 'success' | 'error' | null = null;
  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _portalBridge: PortalBridgeService,
    private _formBuilder: UntypedFormBuilder,
    private _sourceService: SourceService,
    private _companyService: CompanyService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._portalBridge.setPortal(this.portalContent);
    // Create the selected source form
    this.selectedSourceForm = this._formBuilder.group({
      source_id: [''],
      name: ['', Validators.required],
      icon: [''],
      description: [''],
      active_status: [false],
      is_beta: [false],
      is_custom: [false],
      force_connection_test: [false],
      need_auth: [false],
      source_platform: ['', Validators.required],
      dateCreated: [''],
      dateUpdated: [''],
      installedInstances: [''],
      restricted_to_companies: [[]],
    });

    // Set default value for source
    this.selectedSource = this.selectedSourceForm.getRawValue();

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
   * Update the selected source using the form data
   */
  createSource(): void {
    // Get the source object
    const source = this.selectedSourceForm.getRawValue();
    debugger;

    // Remove the currentImageIndex field
    delete source.currentImageIndex;

    // Update the source on the server
    this._sourceService.createSource(source).subscribe(
      () => {
        // Show a success message
        this.showFlashMessage('success');
        if (this.flashMessage === 'success') {
          this.selectedSourceForm.reset();
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
   * FuseDrawer openedChanged
   *
   */
  openedChanged(fuseDrawer): any {
    !fuseDrawer?.opened && this.cancel.emit();
  }

  /**
   * Cancel create source
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
