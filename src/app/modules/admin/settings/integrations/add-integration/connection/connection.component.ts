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
import { Integration, SyncOption } from '../../integrations.types';
import { AddIntegrationService } from '../add-integration.service';

@Component({
    selector: 'eco-add-integration-connection',
    templateUrl: './connection.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegarationConnectionComponent implements OnInit, OnDestroy {
    @Input() integration: Integration;
    connectionForm: UntypedFormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _addIntegrationService: AddIntegrationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.connectionForm = this._formBuilder.group({
            name: [''],
            neatStoreURL: [''],
            username: [''],
            apiKey: [''],
            syncProducts: [false],
            syncInventory: [false],
            syncOrders: [false],
            syncTracking: [false],
        });

        this.connectionForm.patchValue({ ...this.integration });
        this.setSyncOptions();
        this.subscribeOnFormValueChanges();
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
                tap((value) => {
                    const sync = this.updateSyncOptions('products', value);
                    this.setWipIntegration(sync);
                })
            )
            .subscribe();
        this.connectionForm
            .get('syncInventory')
            .valueChanges.pipe(
                takeUntil(this._unsubscribeAll),
                tap((value) => {
                    const sync = this.updateSyncOptions('inventory', value);
                    this.setWipIntegration(sync);
                })
            )
            .subscribe();
        this.connectionForm
            .get('syncOrders')
            .valueChanges.pipe(
                takeUntil(this._unsubscribeAll),
                tap((value) => {
                    const sync = this.updateSyncOptions('orders', value);
                    this.setWipIntegration(sync);
                })
            )
            .subscribe();
        this.connectionForm
            .get('syncTracking')
            .valueChanges.pipe(
                takeUntil(this._unsubscribeAll),
                tap((value) => {
                    const sync = this.updateSyncOptions('tracking', value);
                    this.setWipIntegration(sync);
                })
            )
            .subscribe();
    }

    private updateSyncOptions(key: string, value: any): SyncOption[] {
        return value
            ? [
                  ...this.integration.syncOptions,
                  {
                      key,
                      name: null,
                      form: null,
                      attributes: null,
                      isActive: false,
                  },
              ]
            : this.integration.syncOptions.filter(
                  (syncOption) => syncOption.key !== key
              );
    }

    private setSyncOptions(): void {
        this.integration.syncOptions.forEach((sync) => {
            const { key } = sync;
            switch (key) {
                case 'products':
                    this.connectionForm.patchValue({ syncProducts: true });
                    break;
                case 'inventory':
                    this.connectionForm.patchValue({ syncInventory: true });
                    break;
                case 'orders':
                    this.connectionForm.patchValue({ syncOrders: true });
                    break;
                case 'tracking':
                    this.connectionForm.patchValue({ syncTracking: true });
                    break;
                default:
                    break;
            }
        });
    }

    private setWipIntegration(syncOptions: SyncOption[]): void {
        this._addIntegrationService.wipIntegration = {
            ...this.integration,
            syncOptions,
        };
    }
}
