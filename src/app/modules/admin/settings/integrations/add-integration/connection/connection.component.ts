/* eslint-disable quotes */
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Integration } from '../../integrations.types';
import { AddIntegrationService } from '../add-integration.service';

@Component({
    selector: 'eco-add-integration-connection',
    templateUrl: './connection.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegarationConnectionComponent implements OnInit, OnDestroy {
    @Input() data: Integration;
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

        this.connectionForm.patchValue({ ...this.data });
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
                    const sync = value
                        ? [...this.data.connection.sync, 'products']
                        : this.data.connection.sync.filter(
                              (id) => id !== 'products'
                          );
                    this.setWipIntegration(sync);
                })
            )
            .subscribe();
        this.connectionForm
            .get('syncInventory')
            .valueChanges.pipe(
                takeUntil(this._unsubscribeAll),
                tap((value) => {
                    const sync = value
                        ? [...this.data.connection.sync, 'inventory']
                        : this.data.connection.sync.filter(
                              (id) => id !== 'inventory'
                          );
                    this.setWipIntegration(sync);
                })
            )
            .subscribe();
        this.connectionForm
            .get('syncOrders')
            .valueChanges.pipe(
                takeUntil(this._unsubscribeAll),
                tap((value) => {
                    const sync = value
                        ? [...this.data.connection.sync, 'orders']
                        : this.data.connection.sync.filter(
                              (id) => id !== 'orders'
                          );
                    this.setWipIntegration(sync);
                })
            )
            .subscribe();
        this.connectionForm
            .get('syncTracking')
            .valueChanges.pipe(
                takeUntil(this._unsubscribeAll),
                tap((value) => {
                    const sync = value
                        ? [...this.data.connection.sync, 'tracking']
                        : this.data.connection.sync.filter(
                              (id) => id !== 'tracking'
                          );
                    this._addIntegrationService.wipIntegration = {
                        ...this.data,
                        connection: { ...this.data.connection, sync: sync },
                    };
                })
            )
            .subscribe();
    }

    setSyncOptions(): void {
        this.data.connection.sync.forEach((sync) => {
            switch (sync.toLowerCase()) {
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

    private setWipIntegration(sync: string[]): void {
        this._addIntegrationService.wipIntegration = {
            ...this.data,
            connection: { ...this.data.connection, sync: sync },
        };
    }
}
