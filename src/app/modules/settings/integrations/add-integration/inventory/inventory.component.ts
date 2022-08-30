import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { SyncOptionComponent } from '../common/sync-option/sync-option.component';
import { SyncOptionService } from '../common/sync-option/sync-option.service';

@Component({
  selector: 'eco-add-integration-inventory',
  templateUrl: './inventory.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationInventoryComponent
  extends SyncOptionComponent
  implements OnInit
{
  takeStockFrom = 'take_stock_from';

  /**
   * Constructor
   */
  constructor(
    public _syncOptionService: SyncOptionService,
    private _formBuilder: UntypedFormBuilder
  ) {
    super(_syncOptionService);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.form = this._formBuilder.group({
      isActive: [false],
      takeStockFrom: ['take_from_available'],
      setStockBuffer: [''],
      virtualStockQty: [''],
    });

    this.loadSelectOptions();
    this.form.patchValue({ ...this.syncOption });
  }
}
