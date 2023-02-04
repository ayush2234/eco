/* eslint-disable quotes */
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';
import { Subject, takeUntil } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IntegrationService } from '../../integration.service';
import { Integration, IntegrationInstance, integrationInstanceConnection, IntegrationValue, MappedIntegration, SyncOption } from '../../integration.types';
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
    @Input() mappedIntegration: MappedIntegration;

    @Output() onAddNewIntegration: EventEmitter<any> = new EventEmitter();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        public _syncOptionService: SyncOptionService,
        private _integrationsService: IntegrationService
    ) { }

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
            name: this.instance.integration.name,
            active_status: "Y",
            is_custom: "N",
            connection_status: "Y",
            last_connection_time: "",
            connection: {},
            sync_options: []
        }

        this.instance.integration.connection.fields.forEach(field => {
            this.integrationValue.connection[field.code] = this.mappedIntegration.connection[field.code];
        })
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
                is_active: option.is_active !== undefined ? option.is_active : false,
                is_activated: option.is_activated !== undefined ? option.is_activated : false,
                sub_sync_options: []
            }
        })
    }

    eliminateUnchanged(objectIntegrationValue: IntegrationValue) {
        this.instance.integration.connection.fields.forEach(field => {
            if (objectIntegrationValue.connection[field.code] === this.instance.integration.connection[field.code]) {
                delete objectIntegrationValue.connection[field.code];
            }
        })
    }

    mapFormToInstance() {
        const integrationClone = { ...this.integrationValue };
        this.eliminateUnchanged(integrationClone);
        this.mappedIntegration = {
            ...this.mappedIntegration,
            connection: { ...integrationClone.connection },
            integration_id: this.integrationValue.integration_id
        }
    }

    updateIntegration() {
        console.log("AddIntegration");
        this.mapFormToInstance()
        this._syncOptionService.createIntegration(this.mappedIntegration).pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe(integration => {
            if (integration) {
                this._syncOptionService.mappedIntegration = { ...integration };
                // Refresh Integration Data in Main Screen
                const companyId = LocalStorageUtils.companyId;
                this._integrationsService.getIntegrationSettings(companyId).subscribe();
                this.isAddIntegration = true;
                this.onAddNewIntegration.emit();
            }
        });
    }
    saveIntegration() {
        console.log("Save Integration");
        this.mapFormToInstance()
        this._syncOptionService.updateInstalledIntegration(this.mappedIntegration).pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe(integration => {
            if (integration) {
                this._syncOptionService.mappedIntegration = { ...integration };
            }
        });
    }
}
