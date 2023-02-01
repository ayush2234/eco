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
import { Integration, IntegrationInstance, integrationInstanceConnection, IntegrationValue, SyncOption } from '../../integration.types';
import { SyncOptionService } from '../common/sync-option/sync-option.service';

@Component({
  selector: 'eco-add-integration-connection',
  templateUrl: './connection.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegarationConnectionComponent implements OnInit, OnDestroy {
  connectionForm: UntypedFormGroup;
  @Input() instance: IntegrationInstance;
  @Input() isAddIntegration = false;
  protected _unsubscribeAll: Subject<any> = new Subject<any>();
  integrationValue: IntegrationValue; 
  integrationInstanceConnection: integrationInstanceConnection;
  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    public _syncOptionService: SyncOptionService
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
    this.integrationInstanceConnection = {
      store_url: "https://onesixeightlondon.com.au",
      consumer_key: "ck-5262842efed5eede****",
      consumer_secret: "cs-58de5de5eg5w5ww5g5c****"
    }
    this.integrationValue = {
      source_instance_id: "f8d13159-70dd-4071-8c72-621ff27a9999",
      integration_id: "1ed1f116-8527-6bfa-93c1-0605e1fd6890",
      name: "NewMappingCreateTest123",
      active_status: "Y",
      is_custom: "N",
      connection_status: "Y",
      last_connection_time:"",
      connection: this.integrationInstanceConnection,
      sync_options: this.instance.integration.sync_options
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
      ? ([
          ...this.instance.integration.sync_options,
          {
            code,
            is_activated: false,
          },
        ] as SyncOption[])
      : this.instance.integration.sync_options.filter(
          syncOption => syncOption.code !== code
        );
  }

  setWipIntegration(): void {
    this._syncOptionService.wipIntegration = {
      ...this.instance
    };
  }

  toggleSyncOptions(syncOption: SyncOption): void {
    const syncOptionIndex = this.instance.integration.sync_options.findIndex(
      opt => opt.code === syncOption.code
    );
    this.instance.integration.sync_options[syncOptionIndex].is_active =
      !syncOption.is_active;
    this.setWipIntegration();
  }

  getApiSyncOptions() {
    return this.instance.integration.sync_options.map(option => {
      return {
        code: option.code,
        is_active: option.is_active,
        is_activated: option.is_activated,
        sub_sync_options: []
      }  
    })
  }

  updateIntegration(){
    console.log("AddIntegration");
    const integrationVal = {
      ...this.integrationValue,
      integration_id: this.instance.integration_id,
      name: 'Integration No' + (Math.random() * 10000),
      sync_options: (this.getApiSyncOptions() as any)
    }
    this._syncOptionService.createIntegration(integrationVal).pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(integration => {
      if(integration) {
        const newIntegration = this._syncOptionService.mergeIntegrationData(integration, this.instance.integration);
        this._syncOptionService.wipIntegration = {
          ...this.instance,
          integration: {
            ...this.instance.integration,
            ...newIntegration
          }
        }
      }
    });
  }
  saveIntegration(){
    console.log("Save Integration");
    const integrationVal = {
      ...this.integrationValue,
      integration_id: this.instance.integration.integration_id,
      name: this.instance.integration.name,
      integration_instance_id: this.instance.integration.integration_instance_id,
      sync_options: (this.getApiSyncOptions() as any)
    }
    this._syncOptionService.updateInstalledIntegration(integrationVal).pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(integration => {
      console.log(integration);
      if(integration) {
        const newIntegration = this._syncOptionService.mergeIntegrationData(integration, this.instance.integration);
        this._syncOptionService.wipIntegration = {
          ...this.instance,
          integration: {
            ...this.instance.integration,
            ...newIntegration
          }
        }
      }
    });
  }
}
