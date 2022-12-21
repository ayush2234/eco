import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';
import { Observable, Subject } from 'rxjs';
import { SourceService } from './source.service';
import {
  DearAttributes,
  MagentoAttributes,
  MarapostAttributes,
  MarapostUpdateAttributes,
  SalsifyAttributes,
  Source,
  SourceInstance,
  SourcePayload,
} from './source.types';

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
    debugger;
  }

  /**
   * Update the status of the source
   * @param data of selected source
   * @param event of switch button
   */
  getInstallListActiveInactive(data: any, event: any): void {
    let payload = new SourcePayload();
    payload.source_id = data?.source_id;
    payload.name = data.name;
    payload.active_status = event.checked ? 'Y' : 'N';
    payload.connectionPanel.attributes = this.getAttributes(data);
    this._sourceService
      .updateSourceInstance(
        LocalStorageUtils.companyId,
        payload,
        data.source_instance_id
      )
      .subscribe();
  }

  /**
   * Get Attribute with value added from form.
   * @returns attribute class according to the form type.
   */
  getAttributes(
    data: any
  ):
    | MarapostAttributes
    | MarapostUpdateAttributes
    | SalsifyAttributes
    | MagentoAttributes
    | DearAttributes {
    let attribute:
      | MarapostAttributes
      | MarapostUpdateAttributes
      | SalsifyAttributes
      | MagentoAttributes
      | DearAttributes;
    switch (data?.source_form) {
      case 'maropostSource':
        attribute = new MarapostUpdateAttributes();
        attribute.storeUrl = data?.source_install_name;
        break;
      case 'SalsifySource':
        attribute = new SalsifyAttributes();
        attribute.api_key = data?.api_key;
        break;
      case 'MagentoSource':
        attribute = new MagentoAttributes();
        attribute.access_token = data?.access_token;
        attribute.access_token_secret = data?.access_token_secret;
        attribute.consumer_key = data?.consumer_key;
        attribute.consumer_secret = data?.consumer_secret;
        break;
      case 'DearSource':
        attribute = new DearAttributes();
        attribute.account_id = data?.account_id;
        attribute.application_key = data?.application_key;
        break;

      default:
        break;
    }
    return attribute;
  }
}
