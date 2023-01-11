import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';
import moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { SourceService } from './source.service';
import { Source, SourceInstance, SourcePayload } from './source.types';

@Component({
  selector: 'eco-sources-settings',
  templateUrl: './sources.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourcesComponent implements OnInit, OnDestroy {
  openAddSource: boolean = false;
  selectedSource: SourceInstance;
  selectedSourceInstance: SourcePayload;
  selectedFormType: string;
  isEdit: boolean = false;

  sourceInstances$: Observable<SourceInstance[]>;
  availableSources$: Observable<Source[]>;
  moment = moment;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _sourceService: SourceService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.sourceInstances$ = this._sourceService.sourceInstances$;
    this.availableSources$ = this._sourceService.availableSources$;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.openAddSource = false;
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  /**
   * Add/Update source form opens here
   * @param source selected source
   * @param isEdit is this the Edit form or Add form
   */
  addSource(source: any, isEdit: boolean): void {
    this.selectedSource = null;
    this.selectedSourceInstance = null;
    this.isEdit = isEdit;
    this.selectedFormType = source.source_form;
    if (!isEdit) {
      this.selectedSource = source;
      this.openAddSource = true;
      return;
    }
    this._sourceService
      .getSourceInstance(LocalStorageUtils.companyId, source.source_instance_id)
      .subscribe(
        res => {
          this.selectedSourceInstance = res;
          this.selectedSource = source;
          this.openAddSource = true;
          this._changeDetectorRef.markForCheck();
        },
        error => {
          this.selectedSource = source;
          this.openAddSource = true;
          this._changeDetectorRef.markForCheck();
        }
      );
  }

  /**
   * Update the status of the source
   * @param data of selected source
   * @param event of switch button
   */
  getInstallListActiveInactive(data: any, event: any): void {
    this._sourceService
      .getSourceInstance(LocalStorageUtils.companyId, data.source_instance_id)
      .subscribe(res => {
        res.active_status = event.checked ? 'Y' : 'N';
        delete res['source_instance_id'];
        delete res['source_id'];
        delete res['company_id'];
        this._sourceService
          .updateSourceInstance(
            LocalStorageUtils.companyId,
            res,
            data.source_instance_id
          )
          .subscribe();
      });
  }
}
