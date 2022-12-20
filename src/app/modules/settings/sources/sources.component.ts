import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SourceService } from './source.service';
import { Source, SourceInstance } from './source.types';

@Component({
  selector: 'eco-sources-settings',
  templateUrl: './sources.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourcesComponent implements OnInit, OnDestroy {
  openAddSource: boolean = false;
  selectedSource: Source;
  isEdit: boolean = false;

  sourceInstances$: Observable<SourceInstance[]>;
  availableSources$: Observable<Source[]>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(private _sourceService: SourceService) {}

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
  addSource(source: any, isEdit: boolean): any {
    this.isEdit = isEdit;
    this.selectedSource = source;
    this.openAddSource = true;
    // this._addSourceService.setSelectedSource(source?.id);
  }
}
