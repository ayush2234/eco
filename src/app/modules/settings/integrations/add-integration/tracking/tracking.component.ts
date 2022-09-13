import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Integration, SyncOption } from '../add-integration.types';
import { SyncOptionComponent } from '../common/sync-option/sync-option.component';
import { SyncOptionService } from '../common/sync-option/sync-option.service';

@Component({
  selector: 'eco-add-integration-tracking',
  templateUrl: './tracking.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationTrackingComponent
  extends SyncOptionComponent
  implements OnInit
{
  @Input() integration: Integration;
  @Input() syncOption: SyncOption;
  trackingForm: UntypedFormGroup;
  plans: any[];

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
    this.trackingForm = this._formBuilder.group({
      isActive: [false],
      freeShipping: ['usa'],
      freeExpressShipping: ['usa'],
      standardRateInternational: ['usa'],
    });

    this.trackingForm.patchValue({ ...this.syncOption });
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
