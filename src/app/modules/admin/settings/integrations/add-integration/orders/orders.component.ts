import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {
    Integration,
    SelectOption,
    SyncOption,
} from '../../integrations.types';
import { AddIntegrationService } from '../add-integration.service';
import { AddIntegrationOrdersService } from './orders.service';

@Component({
    selector: 'eco-add-integration-orders',
    templateUrl: './orders.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationOrdersComponent implements OnInit {
    @Input() integration: Integration;
    @Input() syncOption: SyncOption;
    ordersForm: UntypedFormGroup;
    customerOptionsSelectOptionsAdditionalOptions;
    customerOptionsSelectOptionsErp$: Observable<SelectOption[]>;
    existingCustomerSelectOptionsAdditionalOptions;
    existingCustomerSelectOptionsErp$: Observable<SelectOption[]>;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _addIntegrationService: AddIntegrationService,
        private _addIntegrationOrdersService: AddIntegrationOrdersService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.ordersForm = this._formBuilder.group({
            isActive: [false],
            customerOptions: ['create_unique_customer'],
            customerGroup: ['create_unique_customer'],
            orderStatus: [''],
            freeShipping: ['usa'],
            freeExpressShipping: ['usa'],
            standardRateInternational: ['usa'],
            payment: ['usa'],
        });

        this.loadFormControlData();
        this.ordersForm.patchValue({ ...this.syncOption });
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
     * Activate panel
     */
    activatePanel(): void {
        const activatedSyncOption = { ...this.syncOption, isActive: true };
        this._addIntegrationService.wipIntegration = {
            ...this.integration,
            syncOptions: this.integration?.syncOptions?.map((syncOption) =>
                syncOption.key === this.syncOption.key
                    ? activatedSyncOption
                    : syncOption
            ),
        };
    }

    /**
     * Load select options
     */
    loadFormControlData(): void {
        const customerOptions = this.syncOption?.attributes?.find(
            ({ setting }) => setting === 'customer_options'
        );
        const existingCustomer = this.syncOption?.attributes?.find(
            ({ setting }) => setting === 'customer_options'
        );

        this.customerOptionsSelectOptionsAdditionalOptions =
            customerOptions?.additionalOptions;
        this.existingCustomerSelectOptionsAdditionalOptions =
            existingCustomer?.additionalOptions;

        this.customerOptionsSelectOptionsErp$ =
            this._addIntegrationOrdersService.customerOptionsSelectOptionsErp$;
        this.existingCustomerSelectOptionsErp$ =
            this._addIntegrationOrdersService.existingCustomerSelectOptionsErp$;

        if (customerOptions?.fieldType === 'selectFromErp') {
            this._addIntegrationOrdersService.getCustomerOptionsSelectOptionsErp(
                customerOptions.erpValuesList
            );
        }
        if (existingCustomer?.fieldType === 'selectFromErp') {
            this._addIntegrationOrdersService.getExistingCustomerSelectOptionsErp(
                customerOptions.erpValuesList
            );
        }
    }
}
