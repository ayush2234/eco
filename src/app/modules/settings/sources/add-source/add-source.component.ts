/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { CdkPortal } from '@angular/cdk/portal';
import { PortalBridgeService } from 'app/layout/common/eco-drawer/portal-bridge.service';
import { Source, SourceInstance, SourcePayload } from '../source.types';
const addSourcePanels = [
  {
    id: 'connection',
    icon: 'heroicons_outline:user-circle',
    title: 'Connection',
    description: '',
  },
];

@Component({
  selector: 'eco-add-source',
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSourceComponent implements OnInit, OnDestroy {
  @ViewChild(CdkPortal, { static: true })
  portalContent: CdkPortal;
  @ViewChild('drawer') drawer: MatDrawer;
  @Output() cancel = new EventEmitter();
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  fuseDrawerOpened: boolean = true;
  panels: any[] = addSourcePanels;
  panelsConfig: any;
  selectedPanel: string = 'connection';
  wipSource$: Observable<Source>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  @Input() selectedSourceInstance: SourcePayload;
  @Input() selectedSource: SourceInstance;
  @Input() isEdit: boolean = false;
  @Input() isOpen: boolean = false;

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
    this.selectedSource = null;
    this.selectedSourceInstance = null;

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
    return this.panels.find(panel => panel.id === id);
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
}
