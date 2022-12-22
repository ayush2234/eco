/* eslint-disable quotes */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';
import { appConfig } from 'app/core/config/app.config';
import { Subject } from 'rxjs';
import { SourceService } from '../../source.service';
import {
  DearAttributes,
  MagentoAttributes,
  MarapostAttributes,
  MarapostUpdateAttributes,
  SalsifyAttributes,
  Source,
  SourceFormEnum,
  SourcePayload,
} from '../../source.types';

@Component({
  selector: 'eco-add-source-connection',
  templateUrl: './connection.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSourceConnectionComponent implements OnInit, OnDestroy {
  @Input() selectedSource: SourcePayload;
  @Input() selectedFormType: string;
  @Input() isEdit: boolean = false;
  @Input() fuseDrawer: any;
  sourceForm: UntypedFormGroup;
  sourceFormEnum = SourceFormEnum;
  @Output() cancel = new EventEmitter();

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _sourceService: SourceService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.createForm();
    window.addEventListener(
      'message',
      event => {
        if (event.origin !== appConfig.apiConfig.serviceUrl) {
          return;
        }
        console.log(event.data);
        if (!this.sourceForm.valid && this.selectedSource) {
          this.sourceForm.markAllAsTouched();
          return;
        }
        this.isEdit ? this.updateSourceInstance() : this.createSourceInstance();
      },
      false
    );
  }

  createForm(): void {
    switch (SourceFormEnum[this.selectedFormType]) {
      case SourceFormEnum.maropostSource:
        // Create the form maropostSource
        this.sourceForm = this._formBuilder.group({
          storeUrl: [
            this.selectedSource?.connectionPanel?.attributes['storeUrl'],
            [Validators.required],
          ],
        });
        break;

      case SourceFormEnum.SalsifySource:
        // Create the form SalsifySource
        this.sourceForm = this._formBuilder.group({
          apiKey: [
            this.selectedSource?.connectionPanel?.attributes['api_key'],
            [Validators.required],
          ],
        });
        break;

      case SourceFormEnum.MagentoSource:
        // Create the form MagentoSource
        this.sourceForm = this._formBuilder.group({
          consumerKey: [
            this.selectedSource?.connectionPanel?.attributes['consumer_key'],
            [Validators.required],
          ],
          consumerSecret: [
            this.selectedSource?.connectionPanel?.attributes['consumer_secret'],
            [Validators.required],
          ],
          accessToken: [
            this.selectedSource?.connectionPanel?.attributes['access_token'],
            [Validators.required],
          ],
          accessTokenSecret: [
            this.selectedSource?.connectionPanel?.attributes[
              'access_token_secret'
            ],
            [Validators.required],
          ],
        });
        break;

      case SourceFormEnum.DearSource:
        // Create the form DearSource
        this.sourceForm = this._formBuilder.group({
          accountId: [
            this.selectedSource?.connectionPanel?.attributes['account_id'],
            [Validators.required],
          ],
          applicationKey: [
            this.selectedSource?.connectionPanel?.attributes['application_key'],
            [Validators.required],
          ],
        });
        break;

      default:
        break;
    }
  }

  /**
   * login into the source
   */
  loginSource() {
    if (!this.sourceForm.valid) {
      this.sourceForm.markAllAsTouched();
      return;
    }
    if (
      SourceFormEnum[this.selectedFormType] == SourceFormEnum.maropostSource
    ) {
      this._sourceService
        .getMarapostOauthUrl(
          LocalStorageUtils.companyId,
          this.sourceForm.get('storeUrl').value
        )
        .subscribe(res => {
          const newWindow = this.openWindow('', 'message');
          newWindow.location.href = res.auth_url;
        });
    } else {
      this.isEdit ? this.updateSourceInstance() : this.createSourceInstance();
    }
  }

  createSourceInstance() {
    let payload = new SourcePayload();
    payload.source_id = this.selectedSource.source_id;
    payload.name = this.selectedSource.name;
    payload.active_status = 'Y';
    payload.connectionPanel.attributes = this.getAttributes();
    this._sourceService
      .createSourceInstance(LocalStorageUtils.companyId, payload)
      .subscribe(res => {
        this.fuseDrawer.close();
      });
  }

  updateSourceInstance() {
    let payload = new SourcePayload();
    payload.source_id = this.selectedSource.source_id;
    payload.name = this.selectedSource.name;
    payload.active_status = this.selectedSource.active_status ? 'Y' : 'N';
    payload.connectionPanel.attributes = this.getAttributes();
    this._sourceService
      .updateSourceInstance(
        LocalStorageUtils.companyId,
        payload,
        this.selectedSource?.source_instance_id
      )
      .subscribe(res => {
        this.fuseDrawer.close();
      });
  }

  /**
   * Get Attribute with value added from form.
   * @returns attribute class according to the form type.
   */
  getAttributes():
    | MarapostAttributes
    | MarapostUpdateAttributes
    | SalsifyAttributes
    | MagentoAttributes
    | DearAttributes {
    let attribute:
      | MarapostAttributes
      | MarapostUpdateAttributes
      | SalsifyAttributes
      | MagentoAttributes
      | DearAttributes;
    switch (SourceFormEnum[this.selectedFormType]) {
      case SourceFormEnum.maropostSource:
        attribute = this.isEdit
          ? new MarapostUpdateAttributes()
          : new MarapostAttributes();
        attribute.storeUrl = this.sourceForm.get('storeUrl').value;
        break;
      case SourceFormEnum.SalsifySource:
        attribute = new SalsifyAttributes();
        attribute.api_key = this.sourceForm.get('apiKey').value;
        break;
      case SourceFormEnum.MagentoSource:
        attribute = new MagentoAttributes();
        attribute.access_token = this.sourceForm.get('accessToken').value;
        attribute.access_token_secret =
          this.sourceForm.get('accessTokenSecret').value;
        attribute.consumer_key = this.sourceForm.get('consumerKey').value;
        attribute.consumer_secret = this.sourceForm.get('consumerSecret').value;
        break;
      case SourceFormEnum.DearSource:
        attribute = new DearAttributes();
        attribute.account_id = this.sourceForm.get('accountId').value;
        attribute.application_key = this.sourceForm.get('applicationKey').value;
        break;

      default:
        break;
    }
    return attribute;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  openWindow(url, title, options = {}) {
    if (typeof url === 'object') {
      options = url;
      url = '';
    }

    options = { url, title, width: 600, height: 720, ...options };

    const dualScreenLeft =
      window.screenLeft !== undefined
        ? window.screenLeft
        : window.screen['left'];
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screen['top'];
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      window.screen.width;
    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      window.screen.height;

    options['left'] = width / 2 - options['width'] / 2 + dualScreenLeft;
    options['top'] = height / 2 - options['height'] / 2 + dualScreenTop;

    const optionsStr = Object.keys(options)
      .reduce((acc, key) => {
        acc.push(`${key}=${options[key]}`);
        return acc;
      }, [])
      .join(',');

    const newWindow = window.open(url, title, optionsStr);

    if (window.focus) {
      newWindow.focus();
    }

    return newWindow;
  }
}
