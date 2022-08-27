/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'eco-users',
  templateUrl: './users.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
