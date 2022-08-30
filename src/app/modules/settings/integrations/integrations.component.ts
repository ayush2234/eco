import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IntegrationService } from './integration.service';
import { Integration, IntegrationInstance } from './integration.types';

@Component({
  selector: 'eco-integrations-settings',
  templateUrl: './integrations.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationsComponent implements OnInit, OnDestroy {
  openAddIntegration: boolean = false;

  integrationInstances$: Observable<IntegrationInstance[]>;
  availableIntegrations$: Observable<Integration[]>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(private _integrationService: IntegrationService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.integrationInstances$ = this._integrationService.integrationInstances$;
    this.availableIntegrations$ =
      this._integrationService.availableIntegrations$;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
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
   * Add integration
   *
   * @param index
   * @param item
   */
  addIntegration(integration: any): any {
    this.openAddIntegration = true;
    // this._addIntegrationService.setSelectedIntegration(integration?.id);
  }
}
