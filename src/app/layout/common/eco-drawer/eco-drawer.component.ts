import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Portal, PortalBridgeService } from './portal-bridge.service';

@Component({
  selector: 'eco-drawer',
  templateUrl: './eco-drawer.component.html',
  styleUrls: ['./eco-drawer.component.scss'],
})
export class EcoDrawerComponent implements OnInit {
  portal$: Observable<Portal>;

  constructor(private portalBridge: PortalBridgeService) {}

  ngOnInit(): void {
    this.portal$ = this.portalBridge.portal$;
  }
}
