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
    selector: 'eco-add-integration-products',
    templateUrl: './products.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationProductsComponent implements OnInit {
    @Input() data: any;
    productsForm: UntypedFormGroup;

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
        this.productsForm = this._formBuilder.group({
            isActive: [true],
        });

        this.productsForm.patchValue({ ...this.data?.products });
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
            products: { ...this.data?.products, isActive: true },
        };
    }
}
