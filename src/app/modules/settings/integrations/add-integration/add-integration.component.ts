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
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { CdkPortal } from '@angular/cdk/portal';
import { PortalBridgeService } from 'app/layout/common/eco-drawer/portal-bridge.service';
import { SyncOptionService } from './common/sync-option/sync-option.service';
import { SyncOptionComponent } from './common/sync-option/sync-option.component';
import { IntegrationInstance, MappedSyncOption, SyncOption } from '../integration.types';


const connection_code: string = 'connection';
const badgeActiveClasses =
    'px-2 text-sm font-medium w-15 text-center text-green-800 bg-green-100 rounded-full';
// 'px-2 bg-[#4FD1C5] text-sm text-on-primary rounded-full';
const badgeInactiveClasses =
    'px-2 text-sm font-medium w-15 text-center text-red-800 bg-red-100 rounded-full';
// 'px-2 bg-[#DE3A3A] text-sm text-on-primary rounded-full';
const addIntegrationPanels = [
    {
        code: connection_code,
        icon: 'heroicons_outline:user-circle',
        title: 'Connection',
        isActive: true
    },
    {
        code: 'products',
        icon: 'heroicons_outline:lock-closed',
        title: 'Products',
        isActive: false
    },
    {
        code: 'inventory',
        icon: 'heroicons_outline:credit-card',
        title: 'Inventory',
        isActive: false
    },
    {
        code: 'orders',
        icon: 'heroicons_outline:bell',
        title: 'Orders',
        isActive: false
    },
    {
        code: 'tracking',
        icon: 'heroicons_outline:user-group',
        title: 'Tracking',
        isActive: false
    },
];
@Component({
    selector: 'eco-add-integration',
    templateUrl: './add-integration.component.html',
    styleUrls: ['./add-integration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationComponent
    extends SyncOptionComponent implements OnInit, OnDestroy {
    @ViewChild(CdkPortal, { static: true })
    portalContent: CdkPortal;
    @ViewChild('drawer') drawer: MatDrawer;
    @Output() cancel = new EventEmitter();
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    fuseDrawerOpened: boolean = true;
    panels: any[] = [];
    isConnectionActivated = false;
    wipIntegration$: Observable<IntegrationInstance>;
    protected _unsubscribeAll: Subject<any> = new Subject<any>();
    valueListLoader: boolean = false;
    @Input() isOpen = false;
    @Input() isAddIntegration = false;
    addIntegration = false;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _portalBridge: PortalBridgeService,
        public _syncOptionService: SyncOptionService
    ) {
        super(_syncOptionService)
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.addIntegration = this.isAddIntegration;
        this._syncOptionService.valueListLoader$.pipe(takeUntil(this._unsubscribeAll)).subscribe(value => {
            this.valueListLoader = value;
        })
        this._portalBridge.setPortal(this.portalContent);
        this.wipIntegration$ = this._syncOptionService.wipIntegration$.pipe(
            takeUntil(this._unsubscribeAll),
            tap(data => {
                console.log('wipintegration pipe', data);
                // Setup available panels
                this.integrationInstance = { ...data };
                if (data) {
                    this.setPanels();
                    if (this.addIntegration) {
                        this.initMappedIntegration();
                    } else {
                        this.mapOptionsToForm();
                    }
                    console.log(data);
                }
            })
        );

        this._syncOptionService.mappedIntegration$.pipe(
            takeUntil(this._unsubscribeAll),
            tap(data => {
                // Setup available panels
                if (data) {
                    this.mappedIntegration = { ...data }
                    this.addIntegration = false;
                    console.log(data);
                }
            })
        ).subscribe();

        this._syncOptionService.valuesList$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe(response => {
            if (response) {
                this.valuesList = [...response];
                if(!this.addIntegration) {
                    this.mapOptionsToForm();
                }
            }
        });

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

    /**
     * Convert Add Integration Modal Into Configure Integration Modal After Create Integration.
     */
    configureIntegrationAfterCreate(instance: IntegrationInstance) {
        this.addIntegration = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Navigate to the panel
     *
     * @param code
     */
    goToPanel(code: string): void {
        this.panels.forEach(panel => {
            if (panel.code === code) {
                panel.isActive = true;
            } else {
                panel.isActive = false;
            }
        })
        if (code === connection_code) {
            this.selectedPanel = undefined;
        } else {
            this.selectedPanel = this.syncOptions.find(opt => opt.code === code);
            this.setDefaultTab();
        }

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over' && this.drawer) {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param code
     */
    getPanelInfo(code: string): any {
        return this.panels.find(panel => panel.code === code);
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
        this.isOpen ? null : fuseDrawer.close();
        !fuseDrawer?.opened && this.closeDrawer(fuseDrawer);
    }

    closeDrawer(fuseDrawer) {
        fuseDrawer.close();
        this.isOpen = false;
        this.cancel.emit();
    }
    private setPanels(): void {
        const connection = this.integrationInstance.integration.connection;
        this.syncOptions = [...this.integrationInstance.integration.sync_options];
        console.log('integrationInstance', this.integrationInstance, this.syncOptions);
        this.panels = this.syncOptions
            .filter(panel => panel.is_active).map(
                panel => {
                    return {
                        badge: {
                            title: panel.is_activated ? 'Active' : 'Inactive',
                            classes: panel.is_activated
                                ? badgeActiveClasses
                                : badgeInactiveClasses,
                        },
                        code: panel.code,
                        label: panel.label,
                        description: panel.description,
                        isActive: addIntegrationPanels.find(x => x.code === connection.code)?.isActive,
                        icon: addIntegrationPanels.find(x => x.code === panel.code)?.icon
                    }
                }
            );
        if (connection) {
            this.panels.unshift({
                badge: {
                    title: null,
                    classes: null,
                },
                code: connection_code,
                label: 'Connection',
                description: connection.description,
                isActive: true,
                icon: 'heroicons_outline: user- circle'
            })
        }
        console.log('this.panels', this.panels);
        const activePanel = this.panels.find(x => x.isActive);
        console.log('this.panels', activePanel, this.syncOptions[0]?.code); // White screen issue
        this.goToPanel(activePanel ? activePanel.code : this.syncOptions[0]?.code);
    }
}
