/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, switchMap, map, forkJoin, catchError } from 'rxjs';

import { IntegrationInstance, SelectOption, ValuesList } from '../../../integration.types';
import { appConfig } from 'app/core/config/app.config';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';

@Injectable({
  providedIn: 'root',
})
export class SyncOptionService {
  // Private
  private _config = appConfig;
  private _selectedIntegration: BehaviorSubject<IntegrationInstance | null> =
    new BehaviorSubject(null);
  private _wipIntegration: BehaviorSubject<IntegrationInstance | null> =
    new BehaviorSubject(null);
  private _customerOptionsSelectOptions: BehaviorSubject<
    SelectOption[] | null
  > = new BehaviorSubject(null);
  private _customerGroupSelectOptions: BehaviorSubject<SelectOption[] | null> =
    new BehaviorSubject(null);
  private _existingCustomerSelectOptions: BehaviorSubject<
    SelectOption[] | null
  > = new BehaviorSubject(null);
  private _selectedValuesList: BehaviorSubject<string | null> =
    new BehaviorSubject(null);
  private _valuesList: BehaviorSubject<ValuesList[] | null> =
    new BehaviorSubject(null);

  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  set wipIntegration(value: IntegrationInstance) {
    this._wipIntegration.next(value);
  }

  get wipIntegration$(): Observable<IntegrationInstance> {
    return this._wipIntegration.asObservable();
  }

  get valuesList$(): Observable<ValuesList[]> {
    return this._valuesList.asObservable();
  }

  get selectedIntegration$(): Observable<IntegrationInstance> {
    return this._selectedIntegration.asObservable().pipe(
      switchMap(instance =>
        of({
          ...instance,
          integration: {
            ...instance.integration,
            endpoints: [
              {
                origin: 'source',
                type: 'values_list',
              },
              {
                origin: 'channel',
                type: 'values_list',
              },
            ],
            connection: {
              code: 'connection',
              label: 'Connection',
              description:
                'Sync products, inventory, orders and tracking to Maropost',
              connection_instructions: 'For more information on API credentials for Mirakl, please see the following URL:',
              fields: [
                {
                  code: 'integration_name',
                  label: 'Integration Name',
                  type: 'text',
                  value: '',
                },
                {
                  code: 'store_url',
                  label: 'StoreURL',
                  type: 'url',
                  value: 'brianh',
                },
                {
                  code: 'username',
                  label: 'Username',
                  type: 'text',
                  value: '',
                },
                {
                  code: 'api_key',
                  label: 'API Key',
                  type: 'text',
                  value: 'dskjfhdshufiruhfd435rdsvcds',
                }
              ]
            },
            sync_options: [
              {
                is_visible: true,
                is_activated: false,
                code: 'products',
                label: 'Products',
                description:
                  'Configure mapping when syncing products from Maropost to Bunnings',
                sub_sync_options: [
                  {
                    code: 'feed',
                    label: 'Feed',
                    mapping_options: [
                      {
                        code: 'in_usergroup',
                        label: 'UserGroup Visiblity',
                        type: 'option',
                        required: false,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'PRICE_GROUPS',
                            value_type: 'static',
                          },
                        ],
                      },
                      {
                        code: 'custom_field',
                        label: 'Custom Field = True',
                        type: 'option',
                        required: false,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'CUSTOM_FIELDS',
                            value_type: 'static',
                          },
                        ],
                      },
                      {
                        code: 'is_active',
                        label: 'Is Active = True',
                        type: 'option',
                        required: false,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'global',
                            values_list: 'TRUEFALSE',
                            value_type: 'static',
                          },
                        ],
                      },
                      {
                        code: 'is_approved',
                        label: 'Is Approved = True',
                        type: 'option',
                        required: false,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'global',
                            values_list: 'TRUEFALSE',
                            value_type: 'static',
                          },
                        ],
                      },
                      {
                        code: 'pim_ListToBunnings',
                        label: 'List to Bunnings = True',
                        type: 'option',
                        required: false,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'global',
                            values_list: 'TRUEFALSE',
                            value_type: 'static',
                          },
                        ],
                      },
                    ],
                  },

                  {
                    code: 'attribute',
                    label: 'Attributes',
                    mapping_options: [
                      {
                        code: 'CATEGORY',
                        label: 'CATEGORY',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'categories',
                            values_list_origin: 'channel',
                            values_list: 'CATEGORIES',
                            value_type: 'static',
                          },
                        ],
                      },
                      {
                        code: 'DISPLAY_NAME',
                        label: 'DISPLAY_NAME',
                        type: 'attribute',
                        required: true,
                        default_value: 'brand + name',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                          {
                            value_option_type: 'decimal_input',
                            values_list_origin: 'source',
                            value_type: 'static',
                          },
                          {
                            value_option_type: 'text_input',
                            values_list_origin: 'channel',
                            value_type: 'attribute',
                          }
                        ],
                      },
                      {
                        code: 'BRAND',
                        label: 'BRAND',
                        type: 'attribute',
                        required: true,
                        default_value: 'Brand',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'GTIN',
                        label: 'GTIN',
                        type: 'attribute',
                        required: true,
                        default_value: 'UPC',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'PRODUCT_DESCRIPTION',
                        label: 'PRODUCT_DESCRIPTION',
                        type: 'attribute',
                        required: true,
                        default_value: 'Description',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'PRIMARY_UOM',
                        label: 'PRIMARY_UOM',
                        type: 'attribute',
                        required: true,
                        default_value: 'EA',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'VARIANT_GROUP_CODE',
                        label: 'VARIANT_GROUP_CODE',
                        type: 'attribute',
                        required: true,
                        default_value: 'ParentSKU',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'KEY_SELLING_POINT_1',
                        label: 'KEY_SELLING_POINT_1',
                        type: 'attribute',
                        required: true,
                        default_value: '',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'KEY_SELLING_POINT_2',
                        label: 'KEY_SELLING_POINT_2',
                        type: 'attribute',
                        required: true,
                        default_value: '',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'KEY_SELLING_POINT_3',
                        label: 'KEY_SELLING_POINT_3',
                        type: 'attribute',
                        required: true,
                        default_value: '',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'KEY_SELLING_POINT_4',
                        label: 'KEY_SELLING_POINT_4',
                        type: 'attribute',
                        required: false,
                        default_value: '',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'WARRANTY_INFORMATION',
                        label: 'WARRANTY_INFORMATION',
                        type: 'attribute',
                        required: false,
                        default_value: 'Warranty',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'PRODUCT_WIDTH',
                        label: 'PRODUCT_WIDTH',
                        type: 'attribute',
                        required: false,
                        default_value: 'ItemWidth',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'PRODUCT_HEIGHT',
                        label: 'PRODUCT_HEIGHT',
                        type: 'attribute',
                        required: false,
                        default_value: 'ItemHeight',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'PRODUCT_LENGTH',
                        label: 'PRODUCT_LENGTH',
                        type: 'attribute',
                        required: false,
                        default_value: 'ItemLength',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'MATERIAL',
                        label: 'MATERIAL',
                        type: 'attribute',
                        required: false,
                        default_value: 'ItemLength',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'PRODUCT_WEIGHT',
                        label: 'PRODUCT_WEIGHT',
                        type: 'attribute',
                        required: false,
                        default_value: 'ItemWeight',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'PRODUCT_WEIGHT',
                        label: 'PRODUCT_WEIGHT',
                        type: 'attribute',
                        required: false,
                        default_value: 'ItemWeight',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'product-id',
                        label: 'product-id',
                        type: 'attribute',
                        required: false,
                        default_value: 'UPC',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'channel',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'product-id-type',
                        label: 'product-id-type',
                        type: 'attribute',
                        required: false,
                        default_value: 'UPC/EAN',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'channel',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'state',
                        label: 'state',
                        type: 'attribute',
                        required: false,
                        default_value: '11',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'channel',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'logistic-class',
                        label: 'logistic-class',
                        type: 'attribute',
                        required: true,
                        default_value: 'free-shipping',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'channel',
                            values_list: 'ATTRIBUTES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    code: 'pricing',
                    label: 'Pricing',
                    mapping_options: [
                      {
                        code: 'pricegroup',
                        label: 'PriceGroup',
                        type: 'option',
                        required: true,
                        default_value_: '',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'PRICE_GROUPS',
                            value_type: 'static',
                          },
                        ],
                      },
                      {
                        code: 'price_adjustment_type',
                        label: 'Price Adustment Type',
                        type: 'option',
                        required: true,
                        default_value: '',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'global',
                            values_list: 'PRICEADJUSTMENTTYPE',
                            value_type: 'static',
                          },
                        ],
                      },
                      {
                        code: 'price_adjustment_value',
                        label: 'Price Adjustment Value',
                        type: 'option',
                        required: true,
                        default_value: '',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'decimal_input',
                            value_option_label: 'Enter Price Adjustment Amount',
                            value_type: 'static',
                          },
                        ],
                      },
                      {
                        code: 'sync_promo_pricing',
                        label: 'Sync Promo Pricing',
                        type: 'option',
                        required: true,
                        default_value: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'global',
                            values_list: 'TRUEFALSE',
                            value_type: 'static',
                          },
                        ],
                      },
                      {
                        code: 'ignore_promo_dates',
                        label: 'Ignore Promo Dates',
                        type: 'option',
                        required: true,
                        default_value: false,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'global',
                            values_list: 'TRUEFALSE',
                            value_type: 'static',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    code: 'category',
                    label: 'Category',
                    mapping_options: [
                      {
                        code: 'category_option_code',
                        label: 'Category',
                        type: 'option',
                        required: false,
                        default_value: false,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'category',
                            values_list_origin: 'source',
                            value_type: 'attribute',
                          },
                          {
                            value_option_type: 'category',
                            values_list_origin: 'channel',
                            value_type: 'attribute',
                          },
                        ],
                      },
                    ],
                  },

                  {
                    code: 'image',
                    label: 'Images',
                    mapping_options: [
                      {
                        code: 'MainImage',
                        label: 'MainImage',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'IMAGES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'Image1',
                        label: 'Image1',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'IMAGES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'Image2',
                        label: 'Image2',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'IMAGES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'Image3',
                        label: 'Image3',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'IMAGES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'Image4',
                        label: 'Image4',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'IMAGES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'Image5',
                        label: 'Image5',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'IMAGES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'Image6',
                        label: 'Image6',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'IMAGES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'Image7',
                        label: 'Image7',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'IMAGES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'Image8',
                        label: 'Image8',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'IMAGES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'Image9',
                        label: 'Image9',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'IMAGES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              {
                is_visible: true,
                is_activated: true,
                code: 'orders',
                label: 'Orders',
                description:
                  'Configure mapping when syncing orders from Bunnings to Maropost',
                sub_sync_options: [
                  {
                    code: 'customer',
                    label: 'Customer',
                    mapping_options: [
                      {
                        code: 'customer_option',
                        label: 'Customer Option',
                        type: 'option',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'CUSTOMER_OPTIONS',
                            value_type: 'option',
                          },
                        ],
                      },
                      {
                        code: 'Usergroup',
                        label: 'Customer group for new customers',
                        type: 'attribute',
                        required: true,
                        display_conditions:
                          'customer_option == create_unique_customer',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'PRICE_GROUPS',
                            value_type: 'static',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    code: 'order',
                    label: 'Orders',
                    mapping_options: [
                      {
                        code: 'Username',
                        label: 'Existing Customer Username',
                        type: 'attribute',
                        required: true,
                        display_conditions: 'customer_option == link_to_existing_customer',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'text_input',
                            value_option_label: 'Enter Existing Username',
                            value_type: 'static',
                          },
                        ],
                      },
                      {
                        code: 'OrderStatus',
                        label: 'Order Status',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'ORDER_STATUSES',
                            value_type: 'static',
                          },
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'CUSTOM_ORDER_STATUSES',
                            value_type: 'static',
                          },
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'NEW_ORDER_STATUSES',
                            value_type: 'static',
                          },
                        ],
                      },
                      {
                        code: 'ShippingMethod',
                        label: 'Shipping Method',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        child_attribute_values: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'channel',
                            values_list: 'SHIPPING_METHODS',
                            value_type: 'static'
                          }
                        ],
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'SHIPPING_METHODS',
                            value_type: 'static',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    code: 'payment',
                    label: 'Payment',
                    mapping_options: [
                      {
                        code: 'PaymentMethod',
                        label: 'Payment Method',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        child_attribute_values: [
                          {
                            value_list_type: 'channel',
                            values_list: 'PAYMENT_METHODS',
                          },
                        ],
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'PAYMENT_METHODS',
                            value_type: 'static',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                is_visible: true,
                is_activated: true,
                code: 'tracking',
                label: 'Tracking',
                description:
                  'Map Maropost Shipping Services to accepted carriers in Bunnings',
                sub_sync_options: [
                  {
                    code: 'carrier_tab',
                    label: 'Carrier Tab',
                    mapping_options: [
                      {
                        code: 'carrier',
                        label: 'Carrier',
                        type: 'attribute',
                        required: true,
                        selected_value: { label: 'Not Mapped', code: '' },
                        child_attribute_values: [
                          {
                            values_list_origin: 'channel',
                            values_list: 'CARRIERS',
                          },
                        ],
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'SHIPPING_SERVICES',
                            value_type: 'static',
                          },
                        ],
                      }
                    ]
                  },
                ],
              },

              {
                is_visible: true,
                is_activated: false,
                code: 'inventory',
                label: 'Inventory',
                description: '',
                sub_sync_options: [
                  {
                    code: 'inventory_tab',
                    label: 'Inventory Tab',
                    mapping_options: [
                      {
                        code: 'take_stock_from',
                        label: 'Take Stock From',
                        type: 'option',
                        required: true,
                        default_value: 'AvailableSellQauntity',
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            value_origin: 'source',
                            values_list: 'QTY_COMMON_CHOICES',
                            value_type: 'option',
                          },
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'source',
                            values_list: 'WAREHOUSES',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'stock_buffer',
                        label: 'Stock Buffer',
                        type: 'option',
                        required: false,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'decimal_input',
                            value_option_label: 'Enter Stock Buffer Amount',
                            value_type: 'static',
                          },
                          {
                            value_option_type: 'decimal_input',
                            value_option_label: 'Advanced: Custom Source Attribute',
                            value_type: 'attribute',
                          },
                        ],
                      },
                      {
                        code: 'virtual_stock_quantity',
                        label: 'Virtual Stock Quantity',
                        type: 'option',
                        default_value: '500',
                        required: false,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'decimal_input',
                            value_option_label: 'Enter Virtual Stock Quantity',
                            value_type: 'static',
                          },
                        ],
                      },
                      {
                        code: 'holiday_mode',
                        label: 'Holiday Mode',
                        type: 'option',
                        default_value: false,
                        required: false,
                        selected_value: { label: 'Not Mapped', code: '' },
                        value_options: [
                          {
                            value_option_type: 'values_list',
                            values_list_origin: 'global',
                            values_list: 'TRUEFALSE',
                            value_type: 'static',
                          },
                        ],
                      },
                    ]
                  },
                ],
              },
            ],
          }
        })
      ),
      tap(instance => {
        this._wipIntegration.next(instance);
      })
    );
  }

  get fetchValuesList$(): Observable<ValuesList[]> {
    return this._selectedValuesList.asObservable().pipe(
      switchMap(id =>
        of([
          {
            code: 'WAREHOUSES',
            label: 'Maropost Warehouses',
            dynamic: true,
            values: [
              {
                code: '1',
                label: 'Location #1',
              },
            ],
          },
          {
            code: 'PAYMENT_METHODS',
            label: 'Maropost Payment Methods',
            dynamic: true,
            values: [
              {
                code: '14',
                label: 'Account Credit',
              },
              {
                code: '20',
                label: 'Voucher / Reward Points',
              },
              {
                code: '22',
                label: 'POS Cash',
              },
              {
                code: '23',
                label: 'Bank Deposit',
              },
              {
                code: '24',
                label: 'TestPayments',
              },
            ],
          },
          {
            code: 'SHIPPING_METHODS',
            label: 'Maropost Shipping Methods',
            dynamic: true,
            values: [
              {
                code: 'HTF Express',
                label: 'HTF Free Shipping',
              },
              {
                code: 'HTF Express',
                label: 'HTF Express',
              },
              {
                code: 'Standard Shipping',
                label: 'Standard Shipping',
              },
              {
                code: 'Free Express Shipping',
                label: 'Free Express Shipping',
              },
              {
                code: 'Free Express Shipping',
                label: 'Free Express Shipping',
              },
            ],
          },
          {
            code: 'SHIPPING_SERVICES',
            label: 'Maropost Shipping Services',
            dynamic: true,
            values: [
              {
                code: 'Australia Post',
                label: 'Australia Post',
              },
              {
                code: 'Copy of Australia Post',
                label: 'Copy of Australia Post',
              },
              {
                code: 'Standard Shipping',
                label: 'Standard Shipping',
              },
              {
                code: 'Free Shipping',
                label: 'Free Shipping',
              },
            ],
          },
          {
            code: 'CUSTOM_FIELDS',
            label: 'Maropost Custom Fields',
            dynamic: true,
            values: [
              {
                code: 'misc1',
                label: 'Misc1 ShortText Test',
              },
              {
                code: 'misc2',
                label: 'Misc2 TrueFalse Test',
              },
              {
                code: 'misc3',
                label: 'Misc 3 Decimal Test',
              },
            ],
          },
          {
            code: 'PRICE_GROUPS',
            label: 'Maropost User/Price Groups',
            dynamic: true,
            values: [
              {
                code: '1',
                label: 'A',
              },
              {
                code: '2',
                label: 'B',
              },
              {
                code: '3',
                label: 'C',
              },
              {
                code: '7',
                label: 'WooCommerce',
              },
            ],
          },
          {
            code: 'CONTENT_TYPES',
            label: 'Maropost Content Types',
            dynamic: true,
            values: [
              {
                code: 'category',
                label: 'Product Category',
              },
              {
                code: 'page',
                label: 'Web Page',
              },
              {
                code: 'bunningscategory',
                label: 'Bunnings Category',
              },
              {
                code: 'brand',
                label: 'Brand',
              },
            ],
          },
          {
            code: 'ATTRIBUTES',
            label: 'Maropost Attributes',
            dynamic: false,
            values: [
              {
                code: 'ArtistOrAuthor',
                label: 'ArtistOrAuthor',
              },
              {
                code: 'AvailableSellQuantity',
                label: 'AvailableSellQuantity',
              },
              {
                code: 'BaseUnitOfMeasure',
                label: 'BaseUnitOfMeasure',
              },
              {
                code: 'Brand',
                label: 'Brand',
              },
              {
                code: 'BrochureURL',
                label: 'BrochureURL',
              },
              {
                code: 'CostPrice',
                label: 'CostPrice',
              },
              {
                code: 'CubicWeight',
                label: 'CubicWeight',
              },
              {
                code: 'DefaultPrice',
                label: 'DefaultPrice',
              },
              {
                code: 'Description',
                label: 'Description',
              },
              {
                code: 'eBayDescription',
                label: 'eBayDescription',
              },
              {
                code: 'Features',
                label: 'Features',
              },
              {
                code: 'Format',
                label: 'Format',
              },
              {
                code: 'Group',
                label: 'Group',
              },
              {
                code: 'HandlingTime',
                label: 'HandlingTime',
              },
              {
                code: 'IsInventoried',
                label: 'IsInventoried',
              },
              {
                code: 'ItemHeight',
                label: 'ItemHeight',
              },
              {
                code: 'ItemLength',
                label: 'ItemLength',
              },
              {
                code: 'ItemWidth',
                label: 'ItemWidth',
              },
              {
                code: 'Model',
                label: 'Model',
              },
              {
                code: 'ModelNumber',
                label: 'ModelNumber',
              },
              {
                code: 'Name',
                label: 'Name',
              },
              {
                code: 'ParentSKU',
                label: 'ParentSKU',
              },
              {
                code: 'PreOrderQuantity',
                label: 'PreOrderQuantity',
              },
              {
                code: 'PrimarySupplier',
                label: 'PrimarySupplier',
              },
              {
                code: 'PurchaseTaxCode',
                label: 'PurchaseTaxCode',
              },
              {
                code: 'ReferenceNumber',
                label: 'ReferenceNumber',
              },
              {
                code: 'SearchKeywords',
                label: 'SearchKeywords',
              },
              {
                code: 'SellUnitQuantity',
                label: 'SellUnitQuantity',
              },
              {
                code: 'SEOMetaDescription',
                label: 'SEOMetaDescription',
              },
              {
                code: 'SEOMetaKeywords',
                label: 'SEOMetaKeywords',
              },
              {
                code: 'SEOPageHeading',
                label: 'SEOPageHeading',
              },
              {
                code: 'SEOPageTitle',
                label: 'SEOPageTitle',
              },
              {
                code: 'SerialTracking',
                label: 'SerialTracking',
              },
              {
                code: 'ShippingCategory',
                label: 'ShippingCategory',
              },
              {
                code: 'ShippingHeight',
                label: 'ShippingHeight',
              },
              {
                code: 'ShippingLength',
                label: 'ShippingLength',
              },
              {
                code: 'ShippingWeight',
                label: 'ShippingWeight',
              },
              {
                code: 'ShippingWidth',
                label: 'ShippingWidth',
              },
              {
                code: 'ShortDescription',
                label: 'ShortDescription',
              },
              {
                code: 'SKU',
                label: 'SKU',
              },
              {
                code: 'Specifications',
                label: 'Specifications',
              },
              {
                code: 'Subtitle',
                label: 'Subtitle',
              },
              {
                code: 'SupplierItemCode',
                label: 'SupplierItemCode',
              },
              {
                code: 'TaxFreeItem',
                label: 'TaxFreeItem',
              },
              {
                code: 'TaxInclusive',
                label: 'TaxInclusive',
              },
              {
                code: 'TermsAndConditions',
                label: 'TermsAndConditions',
              },
              {
                code: 'Type',
                label: 'Type',
              },
              {
                code: 'UnitOfMeasure',
                label: 'UnitOfMeasure',
              },
              {
                code: 'UPC',
                label: 'UPC',
              },
              {
                code: 'UPC1',
                label: 'UPC1',
              },
              {
                code: 'UPC2',
                label: 'UPC2',
              },
              {
                code: 'UPC3',
                label: 'UPC3',
              },
              {
                code: 'Virtual',
                label: 'Virtual',
              },
              {
                code: 'Warranty',
                label: 'Warranty',
              },
            ],
          },
          {
            code: 'ORDER_STATUSES',
            label: 'Maropost Order Statuses',
            dynamic: false,
            values: [
              {
                code: 'New',
                label: 'New',
              },
              {
                code: 'Pick',
                label: 'Pick',
              },
              {
                code: 'Pack',
                label: 'Pack',
              },
              {
                code: 'On Hold',
                label: 'On Hold',
              },
              {
                code: 'Dispatched',
                label: 'Dispatched',
              },
              {
                code: 'Cancelled',
                label: 'Cancelled',
              },
            ],
          },
          {
            code: 'CUSTOMER_OPTIONS',
            label: 'Integration Customer Behaviour',
            dynamic: false,
            values: [
              {
                code: 'create_unique_customer',
                label: 'Create Unique Customer',
              },
              {
                code: 'link_to_existing_customer',
                label: 'Link to Existing',
              },
            ],
          },
          {
            code: 'DESCRIPTION',
            label: 'Description Formats',
            dynamic: false,
            values: [
              {
                code: 'item.brand + item.name',
                label: 'Brand + Name',
              },
            ],
          },
          {
            code: 'TRUEFALSE',
            label: 'True/False',
            dynamic: false,
            values: [
              {
                code: true,
                label: 'Yes',
              },
              {
                code: false,
                label: 'No',
              },
            ],
          },
          {
            code: 'PRICEADJUSTMENT',
            label: 'Price Adjustment Type',
            dynamic: false,
            values: [
              {
                code: '/',
                label: 'Divide by',
              },
              {
                code: '*',
                label: 'Multiply by',
              },
              {
                code: '-',
                label: 'Subtract',
              },
              {
                code: '+',
                label: 'Add',
              },
            ],
          },
          {
            code: 'QTY_COMMON_CHOICES',
            label: 'Quanity Common Choices',
            dynamic: false,
            values: [
              {
                code: 'AvailableSellQuantity',
                label: 'Available Sell Quanity',
              },
            ],
          },
        ] as any)
      ),
      tap(valuesList => {
        this._valuesList.next(valuesList);
      })
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set selected integration
   */
  setSelectedIntegration(integration: IntegrationInstance): void {
    this._selectedIntegration.next(integration);
    this.getValueList(integration);
  }

  /**
   * Get the values list of all possible origins.
   *
   * @param instance Represents the integration instance for which the values list to be fetched.
   */
  getValueList(instance: IntegrationInstance): void {
    const api = this._config.apiConfig.serviceUrl + '/api/v1/' +
    LocalStorageUtils.companyId + '/integrationInstance/' + instance.instance_id +
    '/values_list?origin=';

    const sourceApi = api + 'source';
    const channelApi = api + 'channel';

    forkJoin([
      this._httpClient.get(sourceApi),
      this._httpClient.get(channelApi)
    ]).pipe(
      catchError(err => {
        this.fetchValuesList$.subscribe();
        return of();
      })
    ).subscribe(response => {
      console.log(response);
      this.fetchValuesList$.subscribe();
      // const list = (response[0] as any).data.values_lists.concat((response[1] as any).data.values_lists);
      // this._valuesList.next(list);
    })
  }

  /**
   * Get mapping
   */
  getMapping(key: string, api: string): Observable<SelectOption[]> {
    return this._httpClient.get(api).pipe(
      map((res: any) => {
        switch (key) {
          case 'ship_method_mapping':
            const shippingMethods =
              res?.shippingMethods?.shippingMethod?.reduce(
                (arr, value) =>
                  value
                    ? [
                        ...arr,
                        {
                          option: value.id,
                          label: value.name,
                        },
                      ]
                    : [...arr],
                []
              );

            return shippingMethods;
          default:
            return res;
        }
      })
    );
  }
}
