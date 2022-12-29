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
import { UserService } from 'app/core/user/user.service';
import { CreateUser } from 'app/core/user/user.types';
import { PortalBridgeService } from 'app/layout/common/eco-drawer/portal-bridge.service';
import { Tag } from 'app/layout/common/grid/grid.types';
import { map, Subject, takeUntil } from 'rxjs';
import { CompanyService } from '../../companies/company.service';
import { SourceService } from '../../sources/source.service';

@Component({
  selector: 'eco-admin-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent implements OnInit, OnDestroy {
  @ViewChild(CdkPortal, { static: true })
  portalContent: CdkPortal;
  @Output() cancel = new EventEmitter();
  fuseDrawerOpened: boolean = true;
  selectedUser: CreateUser | null = null;
  selectedUserForm: UntypedFormGroup;
  companyTags: Tag[];
  filteredCompanyTags: Tag[];
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
    private _userService: UserService,
    private _sourceService: SourceService,
    private _companyService: CompanyService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._portalBridge.setPortal(this.portalContent);
    // Create the selected user form
    this.selectedUserForm = this._formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', Validators.required],
      role: ['', [Validators.required]],
      is_active: [false],
      note: [''],
      companies: [[]],
    });

    // Set default value for user
    this.selectedUser = this.selectedUserForm.getRawValue();

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
        this.companyTags = companies;
        this.filteredCompanyTags = companies;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
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
   * Update the selected user using the form data
   */
  createUser(): void {
    // Get the user object
    const user = this.selectedUserForm.getRawValue();

    // Remove the currentImageIndex field
    delete user.currentImageIndex;
    // Update the user on the server
    this._userService.createUser(user).subscribe(
      () => {
        // Show a success message
        this.showFlashMessage('success');
        if (this.flashMessage === 'success') {
          this.selectedUserForm.reset();
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
   * Filter companies
   *
   *
   * @param event
   */
  filterCompanyTags(event): void {
    // Get the value
    const value = event.target.value.toLowerCase();
    // Filter the companies
    this.filteredCompanyTags = this.companyTags.filter(tag =>
      tag.title.toLowerCase().includes(value)
    );
  }

  /**
   * Filter companies input key down event
   *
   * @param event
   */
  filterCompanyTagsInputKeyDown(event): void {
    // Return if the pressed key is not 'Enter'
    if (event.key !== 'Enter') {
      return;
    }

    // If there is no tag available...
    if (this.filteredCompanyTags.length === 0) {
      // Clear the input
      event.target.value = '';

      // Return
      return;
    }

    // If there is a tag...
    const tag = this.filteredCompanyTags[0];
    const isTagApplied = this.selectedUser.companies.find(id => id === tag.id);

    // If the found tag is already applied to the user...
    if (isTagApplied) {
      // Remove the tag from the user
      this.removeCompanyTagFromUser(tag);
    } else {
      // Otherwise add the tag to the user
      this.addCompanyTagToUser(tag);
    }
  }

  /**
   * Add tag to the user
   *
   * @param tag
   */
  addCompanyTagToUser(tag: Tag): void {
    // Add the tag
    this.selectedUser.companies.unshift(tag.id);

    // Update the selected user form
    this.selectedUserForm
      .get('companies')
      .patchValue(this.selectedUser.companies);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Remove tag from the user
   *
   * @param tag
   */
  removeCompanyTagFromUser(tag: Tag): void {
    // Remove the tag
    this.selectedUser.companies.splice(
      this.selectedUser.companies.findIndex(item => item === tag.id),
      1
    );

    // Update the selected user form
    this.selectedUserForm
      .get('companies')
      .patchValue(this.selectedUser.companies);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Toggle user tag
   *
   * @param tag
   * @param change
   */
  toggleCompanyTag(tag: Tag, change: MatCheckboxChange): void {
    if (change.checked) {
      this.addCompanyTagToUser(tag);
    } else {
      this.removeCompanyTagFromUser(tag);
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
   * Cancel create user
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
