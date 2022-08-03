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
    selector: 'eco-add-integration-tracking',
    templateUrl: './tracking.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationTrackingComponent implements OnInit {
    @Input() data: any;
    trackingForm: UntypedFormGroup;
    plans: any[];

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
        this.trackingForm = this._formBuilder.group({
            isActive: [false],
            freeShipping: ['usa'],
            freeExpressShipping: ['usa'],
            standardRateInternational: ['usa'],
        });

        this.trackingForm.patchValue({ ...this.data?.tracking });
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
            tracking: { ...this.data?.tracking, isActive: true },
        };
    }
}
