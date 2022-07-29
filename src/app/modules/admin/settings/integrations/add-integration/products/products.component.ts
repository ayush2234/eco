import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
    selector: 'eco-add-integration-products',
    templateUrl: './products.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationProductsComponent implements OnInit {
    notificationsForm: UntypedFormGroup;

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.notificationsForm = this._formBuilder.group({
            communication: [true],
            security: [true],
            meetups: [false],
            comments: [false],
            mention: [true],
            follow: [true],
            inquiry: [true],
        });
    }
}
