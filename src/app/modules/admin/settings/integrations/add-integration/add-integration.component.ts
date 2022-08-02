/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { CdkPortal } from '@angular/cdk/portal';
import { PortalBridgeService } from 'app/layout/common/eco-drawer/portal-bridge.service';
import { AddIntegrationService } from './add-integration.service';
import { Integration } from '../integrations.types';

const badgeActiveClasses =
    'px-2 bg-green-500 text-sm text-on-primary rounded-full';
const badgeInactiveClasses =
    'px-2 bg-primary text-sm text-on-primary rounded-full';
const addIntegrationPanels = [
    {
        id: 'connection',
        icon: 'heroicons_outline:user-circle',
        title: 'Connection',
        description: '',
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
        description: '',
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
@Component({
    selector: 'eco-add-integration',
    templateUrl: './add-integration.component.html',
    styleUrls: ['./add-integration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationComponent implements OnInit, OnDestroy {
    @ViewChild(CdkPortal, { static: true })
    portalContent: CdkPortal;
    @ViewChild('drawer') drawer: MatDrawer;
    @Output() cancel = new EventEmitter();
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    fuseDrawerOpened: boolean = true;
    panels: any[] = [];
    panelsConfig: any;
    selectedPanel: string = 'connection';
    selectedIntegration$: Observable<Integration>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _portalBridge: PortalBridgeService,
        private _addIntegrationService: AddIntegrationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._portalBridge.setPortal(this.portalContent);
        this.selectedIntegration$ =
            this._addIntegrationService.selectedIntegration$.pipe(
                tap((data) => {
                    // Setup available panels
                    this.panels = addIntegrationPanels.reduce(
                        (acc, panel) => {
                            let styledPanel: any;
                            switch (panel.id) {
                                case 'products':
                                    styledPanel = {
                                        ...panel,
                                        badge: {
                                            title: data?.products?.isActive
                                                ? 'Active'
                                                : 'Inactive',
                                            classes: data?.products?.isActive
                                                ? badgeActiveClasses
                                                : badgeInactiveClasses,
                                        },
                                    };
                                    break;
                                case 'inventory':
                                    styledPanel = {
                                        ...panel,
                                        badge: {
                                            title: data?.inventory?.isActive
                                                ? 'Active'
                                                : 'Inactive',
                                            classes: data?.inventory?.isActive
                                                ? badgeActiveClasses
                                                : badgeInactiveClasses,
                                        },
                                    };
                                    break;
                                case 'orders':
                                    styledPanel = {
                                        ...panel,
                                        badge: {
                                            title: data?.orders?.isActive
                                                ? 'Active'
                                                : 'Inactive',
                                            classes: data?.orders?.isActive
                                                ? badgeActiveClasses
                                                : badgeInactiveClasses,
                                        },
                                    };
                                    break;
                                case 'tracking':
                                    styledPanel = {
                                        ...panel,
                                        badge: {
                                            title: data?.tracking?.isActive
                                                ? 'Active'
                                                : 'Inactive',
                                            classes: data?.tracking?.isActive
                                                ? badgeActiveClasses
                                                : badgeInactiveClasses,
                                        },
                                    };
                                    break;

                                default:
                                    break;
                            }
                            return data?.connection?.sync?.includes(panel.id)
                                ? [...acc, styledPanel]
                                : [...acc];
                        },
                        [
                            {
                                id: 'connection',
                                icon: 'heroicons_outline:user-circle',
                                title: 'Connection',
                                description: '',
                            },
                        ]
                    );
                })
            );

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

    /**
     * FuseDrawer openedChanged
     *
     */
    openedChanged(fuseDrawer): any {
        !fuseDrawer?.opened && this.cancel.emit();
    }
}
