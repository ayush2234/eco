import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';

@Component({
  selector: 'landing-home',
  template: '',
  encapsulation: ViewEncapsulation.None,
})
export class LandingHomeComponent implements OnInit {
  imporsonate: boolean;
  /**
   * Constructor
   */
  constructor(private authService: AuthService, private router: Router) {}

  // Need to chek and redirect user to respective page.
  ngOnInit(): void {
    const role = this.authService.role;
    if (!role) {
      this.router.navigate(['/sign-in']);
    }
    if (
      role == 'user' ||
      role === 'masterUser' ||
      ((role == 'superAdmin' || role == 'admin') &&
        LocalStorageUtils.impersonate)
    ) {
      this.router.navigate(['user/dashboard']);
    } else if (role == 'superAdmin' || role == 'admin') {
      this.router.navigate(['admin/dashboard']);
    } else {
      this.router.navigate(['/sign-in']);
    }
  }
}
