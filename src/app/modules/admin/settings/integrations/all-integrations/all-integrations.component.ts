import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SyncOptionService } from '../add-integration/common/sync-option/sync-option.service';
import { IntegrationsService } from '../integrations.service';

@Component({
    selector: 'eco-all-integrations',
    templateUrl: './all-integrations.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllIntegrationsComponent implements OnInit, OnDestroy {
    installed: any;
    available: any;
    openAddIntegration: boolean = false;
    selectedIntegration$ = this._addIntegrationService.selectedIntegration$;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _integrationsService: IntegrationsService,
        private _addIntegrationService: SyncOptionService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get installed data
        this._integrationsService.integrations$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.installed = data?.installed;
                this.available = data?.available;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
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
     * Add integration
     *
     * @param index
     * @param item
     */
    addIntegration(integration: any): any {
        this.openAddIntegration = true;
        this._addIntegrationService.setSelectedIntegration(integration?.id);
    }
}
