/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { CdkPortal } from '@angular/cdk/portal';
import { PortalBridgeService } from 'app/layout/common/eco-drawer/portal-bridge.service';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SourceService } from '../source.service';
import { Source, SourcePayload } from '../source.types';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';

const badgeActiveClasses =
  'px-2 bg-green-500 text-sm text-on-primary rounded-full';
const badgeInactiveClasses =
  'px-2 bg-primary text-sm text-on-primary rounded-full';

@Component({
  selector: 'eco-add-source',
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSourceComponent implements OnInit, OnDestroy {
  @ViewChild(CdkPortal, { static: true })
  portalContent: CdkPortal;
  @Output() cancel = new EventEmitter();
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  fuseDrawerOpened: boolean = true;
  panels: any[] = [];
  panelsConfig: any;
  selectedPanel: string = 'connection';
  wipSource$: Observable<Source>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  sourceForm: UntypedFormGroup;
  @Input() selectedSource: Source;
  @Input() isEdit: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _portalBridge: PortalBridgeService,
    private _sourceService: SourceService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.createForm(); // create a form depends on the source type

    this._portalBridge.setPortal(this.portalContent);

    const params = window.location.search;
    if (window.opener) {
      // send them to the opening window
      window.opener.postMessage(params);
      // close the popup
      window.close();
    }
    this.selectedSource;
    debugger;
  }

  createForm(): void {
    debugger;
    switch (this.selectedSource.source_form) {
      case 'maropostSource':
        // Create the form maropostSource
        this.sourceForm = this._formBuilder.group({
          storeUrl: [
            this.selectedSource.source_install_name,
            [Validators.required],
          ],
        });
        break;

      case 'SalsifySource':
        // Create the form SalsifySource
        this.sourceForm = this._formBuilder.group({
          apiKey: [
            this.selectedSource.source_install_name,
            [Validators.required],
          ],
        });
        break;

      case 'MagentoSource':
        // Create the form MagentoSource
        this.sourceForm = this._formBuilder.group({
          consumerKey: [
            this.selectedSource.source_install_name,
            [Validators.required],
          ],
          consumerSecret: [
            this.selectedSource.source_install_name,
            [Validators.required],
          ],
          accessToken: [
            this.selectedSource.source_install_name,
            [Validators.required],
          ],
          accessTokenSecret: [
            this.selectedSource.source_install_name,
            [Validators.required],
          ],
        });
        break;

      default:
        break;
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this.portalContent.detach();
  }

  /**
   * FuseDrawer openedChanged
   *
   */
  openedChanged(fuseDrawer): any {
    !fuseDrawer?.opened && this.cancel.emit();
  }

  /**
   * login into the source
   */
  loginSource() {
    if (!this.sourceForm.valid) {
      this.sourceForm.markAllAsTouched();
      return;
    }
    debugger;
    let storeUrl = this.sourceForm.get('storeUrl').value;
    let url =
      'https://api.netodev.com/oauth/v2/auth?version=2&client_id=cff63e832cf1dcbcb63844db86bb01695da905524c4993dbe7cd9e304ceb6706&redirect_uri=https://app.ecommify.io/integrations/auth/maropost&response_type=code&store_domain=' +
      storeUrl +
      '&state=' +
      LocalStorageUtils.companyId;
    if (url == null) {
      return null;
    }
    this.doAuthorization(url);

    // this.isEdit ? this.updateSourceInstance() : this.createSourceInstance();
  }

  createSourceInstance() {
    let payload = new SourcePayload();
    payload.source_id = this.selectedSource.source_id;
    payload.name = this.selectedSource.name;
    payload.active_status = 'Y';
    payload.connectionPanel.attributes.storeUrl =
      this.sourceForm.get('storeUrl').value;
    this._sourceService
      .createSourceInstance(LocalStorageUtils.companyId, payload)
      .subscribe(res => {
        debugger;
      });
  }

  updateSourceInstance() {
    debugger;
    let payload = new SourcePayload();
    payload.source_id = this.selectedSource.source_id;
    payload.name = this.selectedSource.name;
    payload.active_status = this.selectedSource.active_status ? 'Y' : 'N';
    payload.connectionPanel.attributes.storeUrl =
      this.sourceForm.get('storeUrl').value;
    this._sourceService
      .updateSourceInstance(
        LocalStorageUtils.companyId,
        payload,
        this.selectedSource.source_id
      )
      .subscribe(res => {
        debugger;
      });
  }

  // auth popup related
  private windowHandle: Window; // reference to the window object we will create
  private intervalId: any = null; // For setting interval time between we check for authorization code or token
  private loopCount = 600; // the count until which the check will be done, or after window be closed automatically.
  private intervalLength = 10; // the gap in which the check will be done for code.

  doAuthorization(url: string) {
    let loopCount = this.loopCount;

    /* Create the window object by passing url and optional window title */
    this.windowHandle = this.createOauthWindow(url, 'OAuth login');

    /* Now start the timer for which the window will stay, and after time over window will be closed */
    this.intervalId = window.setInterval(() => {
      if (this.windowHandle) {
        console.log(this.windowHandle.location.href);
      }
      if (loopCount-- < 0) {
        window.clearInterval(this.intervalId);
        this.windowHandle.close();
      } else {
        let href: string; // For referencing window url
        try {
          href = this.windowHandle.location.href; // set window location to href string
        } catch (e) {
          //   console.log('Error:', e); // Handle any errors here
        }
        if (href != null) {
          // Method for getting query parameters from query string
          const getQueryString = function (field: any, url: string) {
            const windowLocationUrl = url ? url : href;
            const reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
            const string = reg.exec(windowLocationUrl);
            return string ? string[1] : null;
          };
          if (href) {
            console.log('href', href);
            if (href.match('code')) {
              console.log('getQueryString', getQueryString('code', href));
              debugger;
              //   this.windowHandle.close();
              //   const code = getQueryString('code', href);
            }
          }
        }
      }
    }, this.intervalLength);
  }

  createOauthWindow(
    url: string,
    name = 'Authorization',
    width = 500,
    height = 600,
    left = 0,
    top = 0
  ) {
    if (url == null) {
      return null;
    }
    const options = `width=${width},height=${height},left=${left},top=${top}`;
    return window.open(url, name, options);
  }
}
