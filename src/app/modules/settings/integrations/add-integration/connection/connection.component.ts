/* eslint-disable quotes */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IntegrationInstance, SyncOption } from '../../integration.types';
import { SyncOptionService } from '../common/sync-option/sync-option.service';

@Component({
  selector: 'eco-add-integration-connection',
  templateUrl: './connection.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegarationConnectionComponent implements OnInit, OnDestroy {
  @Input() instance: IntegrationInstance;
  connectionForm: UntypedFormGroup;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _syncOptionService: SyncOptionService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    // this.connectionForm = this._formBuilder.group({
    //   name: [''],
    //   neatStoreURL: [''],
    //   username: [''],
    //   apiKey: [''],
    //   syncProducts: [false],
    //   syncInventory: [false],
    //   syncOrders: [false],
    //   syncTracking: [false],
    // });

    // this.connectionForm.patchValue({ ...this.integration });
    // this.setSyncOptions();
    // this.subscribeOnFormValueChanges();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  subscribeOnFormValueChanges(): void {
    this.connectionForm
      .get('syncProducts')
      .valueChanges.pipe(
        takeUntil(this._unsubscribeAll),
        tap(value => {
          const sync = this.updateSyncOptions('products', value);
          // this.setWipIntegration(sync);
        })
      )
      .subscribe();
  }

  private updateSyncOptions(code: string, value: any): SyncOption[] {
    return value
      ? [
          ...this.instance.integration.sync_options,
          {
            code,
            is_activated: false,
          }
        ] as SyncOption[]
      : this.instance.integration.sync_options.filter(
          syncOption => syncOption.code !== code
        );
  }

  private setWipIntegration(): void {
    this._syncOptionService.wipIntegration = {
      ...this.instance
    };
  }

  toggleSyncOptions(syncOption: SyncOption): void {
    const syncOptionIndex = this.instance.integration.sync_options
      .findIndex(opt => opt.code === syncOption.code);
    this.instance.integration.sync_options[syncOptionIndex].is_visible = !syncOption.is_visible;
    this.setWipIntegration();
  }
}
