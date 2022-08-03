import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AddIntegrationService } from '../add-integration.service';

@Component({
    selector: 'eco-add-integration-orders',
    templateUrl: './orders.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationOrdersComponent implements OnInit {
    @Input() data: any;
    ordersForm: UntypedFormGroup;

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
        this.ordersForm = this._formBuilder.group({
            isActive: [false],
            customerOptions: [''],
            customerGroup: [''],
            orderStatus: [''],
            freeShipping: ['usa'],
            freeExpressShipping: ['usa'],
            standardRateInternational: ['usa'],
            payment: ['usa'],
        });

        this.ordersForm.patchValue({ ...this.data?.orders });
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
        this._addIntegrationService.wipIntegration = {
            ...this.data,
            orders: { ...this.data?.orders, isActive: true },
        };
    }
}
