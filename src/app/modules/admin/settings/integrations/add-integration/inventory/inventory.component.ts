import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import {
    Integration,
    SelectOption,
    SyncOption,
} from '../../integrations.types';
import { AddIntegrationService } from '../add-integration.service';
import { AddIntegrationInventoryService } from './inventory.service';

@Component({
    selector: 'eco-add-integration-inventory',
    templateUrl: './inventory.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationInventoryComponent implements OnInit {
    @Input() integration: Integration;
    @Input() syncOption: SyncOption;
    inventoryForm: UntypedFormGroup;
    takeStockFromSelectOptionAdditionalOptions;
    takeStockFromSelectOptionsErp$: Observable<SelectOption[]>;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _addIntegrationService: AddIntegrationService,
        private _addIntegrationInventoryService: AddIntegrationInventoryService
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
            takeStockFrom: ['take_from_available'],
            setStockBuffer: [''],
            virtualStockQty: [''],
        });

        this.loadFormControlData();
        this.inventoryForm.patchValue({ ...this.syncOption });
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
        this.takeStockFromSelectOptionsErp$ =
            this._addIntegrationInventoryService.takeStockFromSelectOptions$;

        const takeStockFrom = this.syncOption?.attributes?.find(
            ({ setting }) => setting === 'take_stock_from'
        );

        this.takeStockFromSelectOptionAdditionalOptions =
            takeStockFrom?.additionalOptions;

        if (takeStockFrom?.fieldType === 'selectFromErp') {
            this._addIntegrationInventoryService.getTakeStockFromSelectOptions(
                takeStockFrom.erpValuesList
            );
        }
    }
}
