import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Source } from '../../../source.types';
import { SyncOption } from '../../add-source.types';
import { SyncOptionService } from './sync-option.service';

@Component({
  selector: 'eco-sync-option',
  templateUrl: './sync-option.component.html',
  encapsulation: ViewEncapsulation.None,
})
export abstract class SyncOptionComponent implements OnDestroy {
  @Input() Source: Source;
  @Input() syncOption: SyncOption;

  form: UntypedFormGroup;
  additionalSelectOptions: any;
  erpSelectOptions: any;
  installationSelectOptions: any;
  mappings: any;

  protected _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(public _syncOptionService: SyncOptionService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
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

  /**
   * Activate panel
   */
  activatePanel(): void {
    const activatedSyncOption = { ...this.syncOption, isActive: true };
    this._syncOptionService.wipSource = {
      ...this.Source,
      syncOptions: this.Source?.syncOptions?.map(syncOption =>
        syncOption.key === this.syncOption.key
          ? activatedSyncOption
          : syncOption
      ),
    };
  }

  /**
   * Load select options
   */
  loadSelectOptions(): void {
    this.additionalSelectOptions = this.syncOption?.attributes?.reduce(
      (arr, value) =>
        value
          ? [
              ...arr,
              {
                key: value.setting,
                options: value?.additionalOptions,
              },
            ]
          : [...arr],
      []
    );

    this.erpSelectOptions = this.syncOption?.attributes?.reduce(
      (arr, value) =>
        value.fieldType === 'selectFromErp'
          ? [
              ...arr,
              {
                key: value.setting,
                options: this._syncOptionService.getSelectOptions(
                  value.setting,
                  value.erpValuesList
                ),
              },
            ]
          : [...arr],
      []
    );

    this.installationSelectOptions = this.syncOption?.attributes?.reduce(
      (arr, value) =>
        value.fieldType === 'selectFromInstallation'
          ? [
              ...arr,
              {
                key: value.setting,
                options: this._syncOptionService.getSelectOptions(
                  value.setting,
                  value.installationValuesList
                ),
              },
            ]
          : [...arr],
      []
    );
  }

  /**
   * Load shipping methods
   */
  loadMappings(): void {
    this.mappings = this.syncOption?.attributes?.reduce(
      (arr, value) =>
        value.fieldType === 'mapping'
          ? [
              ...arr,
              {
                key: value.setting,
                source: value.source,
                destination: value.destination,
                sourceMapping: this._syncOptionService.getMapping(
                  value.setting,
                  value.installationValuesList
                ),
                destinationMapping: this._syncOptionService.getMapping(
                  value.setting,
                  value.erpValuesList
                ),
              },
            ]
          : [...arr],
      []
    );
  }
}
