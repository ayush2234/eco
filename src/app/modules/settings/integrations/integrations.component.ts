import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SyncOptionService } from './add-integration/common/sync-option/sync-option.service';
import { IntegrationService } from './integration.service';
import { Integration, IntegrationInstance } from './integration.types';

@Component({
  selector: 'eco-integrations-settings',
  templateUrl: './integrations.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationsComponent implements OnInit, OnDestroy {
  openIntegrationView: boolean = false;
  isAddIntegration = false;
  integrationInstances$: Observable<IntegrationInstance[]>;
  availableIntegrations$: Observable<Integration[]>;
  selectedIntegration$ = this._syncOptionService.selectedIntegration$;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _integrationService: IntegrationService,
    private _syncOptionService: SyncOptionService
  ) {}

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
    this.openIntegrationView = false;
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
  addIntegration(instance: IntegrationInstance): any {
    this.openIntegrationView = true;
    this.isAddIntegration = true;
    this._syncOptionService.setSelectedIntegration(instance);
  }

  configureIntegration(instance: IntegrationInstance): any {
    this.openIntegrationView = true;
    this.isAddIntegration = false;
    this._syncOptionService.setSelectedIntegration(instance);
  }
}
