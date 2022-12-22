import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'eco-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  goBacktoSignIn() {
    this.router.navigate(['sign-in']);
  }
}
