/* eslint-disable quotes */
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostListener,
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
import { SnackbarService } from '../../../../../shared/service/snackbar.service';
import { Ioauth_SuccessToken } from '../../../sources/source.types';
import { IntegrationService } from '../../integration.service';
import { Integration, IntegrationInstance, integrationInstanceConnection, IntegrationSettings, IntegrationValue, MappedIntegration, SyncOption } from '../../integration.types';
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
    @Input() mappedIntegration: MappedIntegration;

    @Output() onAddNewIntegration: EventEmitter<any> = new EventEmitter();
    @Output() onClose: EventEmitter<any> = new EventEmitter();
    verificationData: Ioauth_SuccessToken;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        public _syncOptionService: SyncOptionService,
        private _integrationsService: IntegrationService,
        private _snackbarService: SnackbarService
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
        this.integrationValue = {
            source_instance_id: "f8d13159-70dd-4071-8c72-621ff27a9999",
            integration_id: "",
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
            if (objectIntegrationValue.connection[field.code] === this.mappedIntegration.connection[field.code]) {
                delete objectIntegrationValue.connection[field.code];
            }
        })
    }

    mapFormToInstance() {
        const integrationClone = { ...this.integrationValue };
        this.eliminateUnchanged(integrationClone);
        this.mappedIntegration = {
            ...this.mappedIntegration,
            connection: this.verificationData ? { ...integrationClone.connection, ...this.verificationData } : { ...integrationClone.connection },
            integration_id: this.isAddIntegration ? this.instance.integration_id : this.instance.integration.integration_id,
            sync_options: this.mappedIntegration.sync_options.map(x => ({
                ...x,
                is_active: this.instance.integration.sync_options.find(s => s.code === x.code)?.is_active,
                is_activated: this.instance.integration.sync_options.find(s => s.code === x.code)?.is_activated
            }))
        }
    }

    /**
     * Added to listen the 'message' thrown by popup modal on success 
     * @param event 
     */
    @HostListener('window:message', ['$event'])
    messageListener(event: MessageEvent<any>) {
        if(event?.data?.error) this._snackbarService.showError('Please check domain Url, some error occured !!');
        else {
        this.verificationData = {...event?.data}
        if (this.verificationData && this.verificationData?.access_token) this._snackbarService.showSuccess('Verification Successful !!');
        // console.log(this.verificationData);
        }
    }


    /**
     * Verify OAuth, copied and updated as per Integrations
     */
    verify() {
        const storeUrl = this.integrationValue?.connection?.storeURL;
        if (!storeUrl) return;
        this._integrationsService.getMaropostOauthUrl(LocalStorageUtils.companyId, storeUrl)
        .subscribe(res => {
            this.verificationData = undefined // IMP - to set it null before each call.
            const newWindow = this.openWindow('', 'message');
            newWindow.location.href = res.auth_url;
        });
        
    }

    // Cloned from source
    openWindow(url, title, options = {}) {
        if (typeof url === 'object') {
            options = url;
            url = '';
        }
        options = { url, title, width: 600, height: 720, ...options };

        const dualScreenLeft =
        window.screenLeft !== undefined
            ? window.screenLeft
            : window.screen['left'];
        const dualScreenTop =
        window.screenTop !== undefined ? window.screenTop : window.screen['top'];
        const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        window.screen.width;
        const height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        window.screen.height;

        options['left'] = width / 2 - options['width'] / 2 + dualScreenLeft;
        options['top'] = height / 2 - options['height'] / 2 + dualScreenTop;

        const optionsStr = Object.keys(options)
        .reduce((acc, key) => {
            acc.push(`${key}=${options[key]}`);
            return acc;
        }, [])
        .join(',');

        const newWindow = window.open(url, title, optionsStr);

        if (window.focus) {
        newWindow.focus();
        }

        return newWindow;
    }

    // Name of the function should be add and not update, since it is Create (POST)
    addIntegration() {
        console.log("AddIntegration");
        this.mapFormToInstance();
        this._syncOptionService.createIntegration(this.mappedIntegration).pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe(integration => {
            if (integration) {
                this._syncOptionService.mappedIntegration = { ...integration };
                // Refresh Integration Data in Main Screen
                const companyId = LocalStorageUtils.companyId;
                this._integrationsService.getIntegrationSettings(companyId).pipe(takeUntil(this._unsubscribeAll)).subscribe((response: IntegrationSettings) => {
                    // this.isAddIntegration = true;
                    const createdInstance = response.instances.find(instance => instance.instance_id == integration.integration_instance_id)
                    this._syncOptionService.getValueList(createdInstance);
                    this.onAddNewIntegration.emit();
                });
            }
        });
    }

    // Name of the function should be update, since it is Update (PUT)
    updateIntegration() {
        console.log("updateIntegration");
        this.mapFormToInstance();
        this._syncOptionService.updateInstalledIntegration(this.mappedIntegration).pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe(integration => {
            if (integration) {
                this._syncOptionService.mappedIntegration = { ...integration };
                this.onClose.emit();
            }
        });
    }
}
