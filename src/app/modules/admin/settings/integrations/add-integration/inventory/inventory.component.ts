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
    selector: 'eco-add-integration-inventory',
    templateUrl: './inventory.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationInventoryComponent implements OnInit {
    @Input() data: any;
    inventoryForm: UntypedFormGroup;

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
        this.inventoryForm = this._formBuilder.group({
            isActive: [false],
            takeStockFrom: [''],
            setStockBuffer: [''],
            virtualStockQty: [''],
        });

        this.inventoryForm.patchValue({ ...this.data?.inventory });
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
            inventory: { ...this.data?.inventory, isActive: true },
        };
    }
}
