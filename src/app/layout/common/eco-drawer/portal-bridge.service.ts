/* eslint-disable @typescript-eslint/member-ordering */
import {
  TemplatePortal,
  ComponentPortal,
  DomPortal,
} from '@angular/cdk/portal';
import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

export type Portal = TemplatePortal | ComponentPortal<any> | DomPortal;

@Injectable({
  providedIn: 'root',
})
export class PortalBridgeService {
  private activePortal = new BehaviorSubject<Portal>(null);

  readonly portal$ = this.activePortal.asObservable();

  constructor() {}

  setPortal(portal: Portal): void {
    this.activePortal.next(portal);
  }
}
