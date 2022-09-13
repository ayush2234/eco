import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Integration, SyncOption } from '../../integration.types';
import { SyncOptionComponent } from '../common/sync-option/sync-option.component';
import { SyncOptionService } from '../common/sync-option/sync-option.service';

@Component({
  selector: 'eco-add-integration-products',
  templateUrl: './products.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationProductsComponent
  extends SyncOptionComponent
  implements OnInit
{
  @Input() syncOption: SyncOption;
  productsForm: UntypedFormGroup;

  /**
   * Constructor
   */
  constructor(
    public _syncOptionService: SyncOptionService,
    public _formBuilder: UntypedFormBuilder
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
    this.productsForm = this._formBuilder.group({
      isActive: [true],
    });

    this.productsForm.patchValue({ ...this.syncOption });
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
}
