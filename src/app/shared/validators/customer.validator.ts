import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { CustomerService } from 'app/core/customer/customer.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class CustomerValidator {
  static createValidator(customerService: CustomerService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> =>
      customerService
        .checkIfCustomerExists(control.value)
        .pipe(
          map((result: boolean) =>
            result ? { customerlreadyExists: true } : null
          )
        );
  }
}
