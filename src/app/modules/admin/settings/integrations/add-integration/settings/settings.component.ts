/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { CdkPortal } from '@angular/cdk/portal';
import { PortalBridgeService } from 'app/layout/common/eco-drawer/portal-bridge.service';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationComponent implements OnInit, OnDestroy {
    @ViewChild(CdkPortal, { static: true })
    portalContent: CdkPortal;
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'connection';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _portalBridge: PortalBridgeService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._portalBridge.setPortal(this.portalContent);
        // Setup available panels
        this.panels = [
            {
                id: 'connection',
                icon: 'heroicons_outline:user-circle',
                title: 'Connection',
                heading: 'Add Maropost Commerce Cloud',
                description:
                    'Sync products, inventory, orders and tracking to Maropost',
            },
            {
                id: 'products',
                icon: 'heroicons_outline:lock-closed',
                title: 'Products',
                description: '',
            },
            {
                id: 'inventory',
                icon: 'heroicons_outline:credit-card',
                title: 'Inventory',
                heading: 'Add Maropost Commerce Cloud',
                description:
                    'Sync products, inventory, orders and tracking to Maropost',
            },
            {
                id: 'orders',
                icon: 'heroicons_outline:bell',
                title: 'Orders',
                description: '',
            },
            {
                id: 'tracking',
                icon: 'heroicons_outline:user-group',
                title: 'Tracking',
                description: '',
            },
        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this.portalContent.detach();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any {
        return this.panels.find((panel) => panel.id === id);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
