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
import { SyncLogsService } from '../../../user/sync-logs/sync-logs.service';
import { SyncLog } from '../../../user/sync-logs/sync-logs.types';

@Component({
  selector: 'eco-sync-logs-products',
  templateUrl: './products.component.html',
  styles: [
    /* language=SCSS */
    `
      .sync-logs-products-grid {
        grid-template-columns: repeat(3, 1fr);

        @screen sm {
          grid-template-columns: repeat(3, 1fr) 72px;
        }

        @screen md {
          grid-template-columns: repeat(9, 1fr) 72px;
        }

        @screen lg {
          grid-template-columns: 141px 2.5fr repeat(1, 1fr) 2fr repeat(6, 1fr) 121px;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class SyncLogsProductsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  syncLogs$: Observable<SyncLog[]>;

  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  pagination: Pagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedSyncLog: SyncLog | null = null;
  selectedSyncLogForm: UntypedFormGroup;
  tags: Tag[];
  filteredTags: Tag[];
  tagsEditMode: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _syncLogService: SyncLogsService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  getStatus(status) {
    switch (status) {
      case 'Ok':
        return '#22bfb7';
      case 'Warning':
        return '#e0af0b';
      case 'Error':
        return '#c92d0e';
    }
  }
  /**
   * On init
   */
  ngOnInit(): void {
    // Create the selected syncLog form
    this.selectedSyncLogForm = this._formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: [''],
      role: [''],
      active: [''],
      notes: [''],
      tags: [[]],
    });

    // Get the pagination
    this._syncLogService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: Pagination) => {
        // Update the pagination

        this.pagination = pagination;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Get the syncLogs
    this.syncLogs$ = this._syncLogService.syncLogs$;

    // Get the tags
    this._syncLogService.tags$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((tags: Tag[]) => {
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
        switchMap(query => {
          this.closeDetails();
          this.isLoading = true;
          return this._syncLogService.getSyncLogProducts(
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

      // If the syncLog changes the sort order...
      this._sort.sortChange
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          // Reset back to the first page
          this._paginator.pageIndex = 0;

          // Close the details
          this.closeDetails();
        });

      // Get syncLogs if sort or page changes
      merge(this._sort.sortChange, this._paginator.page)
        .pipe(
          switchMap(() => {
            this.closeDetails();
            this.isLoading = true;
            return this._syncLogService.getSyncLogProducts(
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
   * Toggle syncLog details
   *
   * @param syncLogId
   */
  toggleDetails(syncLogId: string): void {
    // If the syncLog is already selected...
    if (this.selectedSyncLog && this.selectedSyncLog.syncId === syncLogId) {
      // Close the details
      this.closeDetails();
      return;
    }

    // Get the syncLog by id
    this._syncLogService.getSyncLogById(syncLogId).subscribe(syncLog => {
      // Set the selected syncLog
      this.selectedSyncLog = syncLog;

      // Fill the form
      this.selectedSyncLogForm.patchValue(syncLog);

      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * Close the details
   */
  closeDetails(): void {
    this.selectedSyncLog = null;
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
        tag => tag.title.toLowerCase() === inputValue.toLowerCase()
      ) > -1
    );
  }

  /**
   * Create syncLog
   */
  createSyncLog(): void {
    // Create the syncLog
    this._syncLogService.createSyncLog().subscribe(newsyncLog => {
      // Go to new syncLog
      this.selectedSyncLog = newsyncLog;

      // Fill the form
      this.selectedSyncLogForm.patchValue(newsyncLog);

      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * Update the selected syncLog using the form data
   */
  updateSelectedSyncLog(): void {
    // Get the syncLog object
    const syncLog = this.selectedSyncLogForm.getRawValue();

    // Remove the currentImageIndex field
    delete syncLog.currentImageIndex;

    // Update the syncLog on the server
    this._syncLogService.updateSyncLog(syncLog.id, syncLog).subscribe(() => {
      // Show a success message
      this.showFlashMessage('success');
    });
  }

  /**
   * Delete the selected syncLog using the form data
   */
  deleteSelectedSyncLog(): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete syncLog',
      message:
        'Are you sure you want to remove this syncLog? This action cannot be undone!',
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
        // Get the syncLog object
        const syncLog = this.selectedSyncLogForm.getRawValue();

        // Delete the syncLog on the server
        this._syncLogService.deleteSyncLog(syncLog.id).subscribe(() => {
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
