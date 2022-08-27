import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Integration, SyncOption } from '../../integrations.types';
import { SyncOptionService } from '../common/sync-option/sync-option.service';

@Component({
  selector: 'eco-add-integration-tracking',
  templateUrl: './tracking.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationTrackingComponent implements OnInit {
  @Input() integration: Integration;
  @Input() syncOption: SyncOption;
  trackingForm: UntypedFormGroup;
  plans: any[];

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _addIntegrationService: SyncOptionService
  ) {}

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

  /**
   * Activate panel
   */
  activatePanel(): void {
    const activatedSyncOption = { ...this.syncOption, isActive: true };
    this._addIntegrationService.wipIntegration = {
      ...this.integration,
      syncOptions: this.integration?.syncOptions?.map(syncOption =>
        syncOption.key === this.syncOption.key
          ? activatedSyncOption
          : syncOption
      ),
    };
  }
}
