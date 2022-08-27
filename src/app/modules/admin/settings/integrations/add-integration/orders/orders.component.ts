/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { CustomerService } from 'app/core/customer/customer.service';
import { CustomerValidator } from 'app/shared/validators/customer.validator';
import { takeUntil, tap } from 'rxjs';
import { SyncOptionComponent } from '../common/sync-option/sync-option.component';
import { SyncOptionService } from '../common/sync-option/sync-option.service';

@Component({
  selector: 'eco-add-integration-orders',
  templateUrl: './orders.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationOrdersComponent
  extends SyncOptionComponent
  implements OnInit, OnDestroy
{
  customerOptions = 'customer_options';
  customerGroup = 'customer_group';
  existingCustomer = 'existing_customer';
  orderStatus = 'order_status';
  paymentMethodMapping = 'payment_method_mapping';

  /**
   * Constructor
   */
  constructor(
    public _syncOptionService: SyncOptionService,
    public _formBuilder: UntypedFormBuilder,
    private _customerService: CustomerService
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
      customerOptions: ['create_unique_customer'],
      customerGroup: ['id1'],
      orderStatus: ['Pick'],
      freeShipping: ['usa'],
      freeExpressShipping: ['usa'],
      standardRateInternational: ['usa'],
      payment: ['do_not_mark_as_paid'],
    });

    this.loadSelectOptions();
    this.loadMappings();
    this.subscribeOnFormValueChanges();
    this.form.patchValue({ ...this.syncOption });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Subscribe on Form Value Changes
   */
  subscribeOnFormValueChanges(): void {
    this.form
      .get('customerOptions')
      ?.valueChanges.pipe(
        takeUntil(this._unsubscribeAll),
        tap(value => {
          value === 'link_to_existing'
            ? this.form.addControl(
                'existingCustomer',
                this._formBuilder.control(
                  '',
                  [],
                  [CustomerValidator.createValidator(this._customerService)]
                )
              )
            : this.form.removeControl('existingCustomer');

          value === 'create_unique_customer'
            ? this.form.addControl(
                'customerGroup',
                this._formBuilder.control(['id1'])
              )
            : this.form.removeControl('customerGroup');
        })
      )
      .subscribe();
  }
}
