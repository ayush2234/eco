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
import { Integration, MAPPING_OPTIONS_TYPE, SyncOption, ValuesList, ValuesListOptions } from './add-integration.types';
import { SyncOptionComponent } from './common/sync-option/sync-option.component';

const badgeActiveClasses =
  'px-2 bg-green-500 text-sm text-on-primary rounded-full';
const badgeInactiveClasses =
  'px-2 bg-primary text-sm text-on-primary rounded-full';
const addIntegrationPanels = [
  {
    code: 'connection',
    icon: 'heroicons_outline:user-circle',
    title: 'Connection',
    description: '',
  },
  {
    code: 'products',
    icon: 'heroicons_outline:lock-closed',
    title: 'Products',
    description: '',
  },
  {
    code: 'inventory',
    icon: 'heroicons_outline:credit-card',
    title: 'Inventory',
    description: '',
  },
  {
    code: 'orders',
    icon: 'heroicons_outline:bell',
    title: 'Orders',
    description: '',
  },
  {
    code: 'tracking',
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

  wipIntegration$: Observable<Integration>;
  protected _unsubscribeAll: Subject<any> = new Subject<any>();
  @Input() isOpen = false;

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
    this._portalBridge.setPortal(this.portalContent);
    this.wipIntegration$ = this._syncOptionService.wipIntegration$.pipe(
      tap(data => {
        // Setup available panels
        this.setPanels(data?.sync_options);
        console.log(data);
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
   * @param code
   */
  goToPanel(code: string): void {
    this.selectedPanel = this.syncOptions.find(opt => opt.code === code);
    this.setDefaultGroup();
  
    // Close the drawer on 'over' mode
    if (this.drawerMode === 'over') {
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
    !fuseDrawer?.opened && this.closeDrawer();
  }

  closeDrawer() {
    this.isOpen = false;
    this.cancel.emit();
  }
  private setPanels(data: SyncOption[]): void {
    this.syncOptions = data.filter(opt => opt.type === MAPPING_OPTIONS_TYPE.sync_option);
    this.panels = this.syncOptions.map(
      panel => {
        return {
          badge: {
            title: panel.isActive ? 'Active' : 'Inactive',
            classes: panel.isActive
              ? badgeActiveClasses
              : badgeInactiveClasses,
          },
          code: panel.code,
          label: panel.label,
          description: panel.description,
          icon: addIntegrationPanels.find(x => x.code === panel.code)?.icon
        }
      }
    );
    if(this.syncOptions.length) {
      this.goToPanel(this.syncOptions[0].code);
    }
  }
}
