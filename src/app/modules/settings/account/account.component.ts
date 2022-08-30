import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { Integration } from '../integrations/integration.types';

@Component({
  selector: 'eco-settings-account',
  templateUrl: './account.component.html',
})
export class SettingsAccountComponent implements OnInit, OnDestroy {
  @Input() integration: Integration;
  accountForm: UntypedFormGroup;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _userService: UserService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.accountForm = this._formBuilder.group({
      name: [''],
      email: [''],
      phone: [''],
      password: [''],
      newPassword: [''],
    });

    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.accountForm.patchValue({ ...user });
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
