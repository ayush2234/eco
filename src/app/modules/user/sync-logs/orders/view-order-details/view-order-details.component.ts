import { CdkPortal } from '@angular/cdk/portal';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { PortalBridgeService } from 'app/layout/common/eco-drawer/portal-bridge.service';

@Component({
  selector: 'eco-view-order-details',
  templateUrl: './view-order-details.component.html',
  styles: [
    /* language=SCSS */
    `
      .order-details-grid {
        grid-template-columns: repeat(5, 1fr);

        @screen sm {
          grid-template-columns: repeat(4, 1fr) 72px;
        }

        @screen md {
          grid-template-columns: repeat(4, 1fr) 72px;
        }

        @screen lg {
          grid-template-columns: 1fr 1fr repeat(1, 2fr) 72px;
        }
      }
    `,
  ],
})
export class ViewOrderDetailsComponent implements OnInit {
  @ViewChild(CdkPortal, { static: true })
  portalContent: CdkPortal;
  @Output() cancel = new EventEmitter();
  @Input() orders!: any;
  fuseDrawerOpened: boolean = true;
  orderDetails: any;
  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _portalBridge: PortalBridgeService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._portalBridge.setPortal(this.portalContent);
    this.orderDetails = this.orders;
    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.fuseDrawerOpened = false;
    this._changeDetectorRef.detectChanges();
  }

  openedChanged(fuseDrawer): any {
    !fuseDrawer?.opened && this.cancel.emit();
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Cancel view product details
   *
   */
  onCancel(): any {
    this.fuseDrawerOpened = false;
  }
}
