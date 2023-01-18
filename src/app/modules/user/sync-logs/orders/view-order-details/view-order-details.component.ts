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
import { UntypedFormGroup } from '@angular/forms';
import { Company } from 'app/core/user/user.types';
import { PortalBridgeService } from 'app/layout/common/eco-drawer/portal-bridge.service';
import { Tag } from 'app/layout/common/grid/grid.types';

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
  errorMsg: string;
  @Output() cancel = new EventEmitter();
  @Input() details!: any;
  fuseDrawerOpened: boolean = true;
  flashMessage: 'success' | 'error' | null = null;
  selectedCompany: Company | null = null;
  selectedCompanyForm: UntypedFormGroup;
  restrictedToIntegrationTags: Tag[];
  filteredRestrictedToIntegrationTags: Tag[];
  restrictedToSourceTags: Tag[];
  filteredRestrictedToSourceTags: Tag[];
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
    console.log(this.details);
    this.orderDetails = this.details;
  }

  ngOnDestroy(): void {
    this.fuseDrawerOpened = false;
  }

  openedChanged(fuseDrawer): any {
    !fuseDrawer?.opened && this.cancel.emit();
  }

  /**
   * Cancel create company
   *
   */
  onCancel(): any {
    this.fuseDrawerOpened = false;
  }
}
