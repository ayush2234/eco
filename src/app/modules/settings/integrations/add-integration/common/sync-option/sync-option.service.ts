/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, switchMap, map, forkJoin, catchError, mergeMap } from 'rxjs';

import { Integration, IntegrationInstance, IntegrationValue, SelectOption, ValuesList } from '../../../integration.types';
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
      tap(instance => {
        const isAddIntegration = instance.integration_id ? true : false
        const integrationId = isAddIntegration ? instance.integration_id : instance.integration.integration_id;
        const api = this._config.apiConfig.baseUrl + '/' + LocalStorageUtils.companyId
        this._httpClient.get(api + '/integration/' + integrationId + '/form').pipe(
          catchError(err => {
            return of();
          }),
          mergeMap((res: any) => {
            const formResult = res.result;
            if(isAddIntegration) {
              formResult.sync_options = formResult.sync_options.map(x => {
                return {
                  ...x,
                  is_active: false,
                  is_activated: false
                }
              })
              return of(formResult)
            } else {
              return this._httpClient.get(api + '/integration/instance/' + instance.instance_id).pipe(
                mergeMap((intResponse: any) => {
                  const integrationResponse = intResponse.result;
                  const populatedData = this.mergeIntegrationData(integrationResponse, formResult)
                  return of(populatedData)
                })
              )
            }
          })
        ).subscribe((integrationForm: any) => {
          this._wipIntegration.next({
            ...instance,
            integration: {
              ...instance.integration,
              ...integrationForm
            }
          });
        });
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

  createIntegration(integrationValue: IntegrationValue){
    const apiUrl= this._config.apiConfig.baseUrl;
    const api =  `${apiUrl}/${LocalStorageUtils.companyId}/integration/instance`;
    return this._httpClient.post(api, integrationValue).pipe(
      map((x: any) => x.result),
      catchError(err => {
        return of();
      })
    )
  }
  updateInstalledIntegration(integrationValue: IntegrationValue){
    const apiUrl= this._config.apiConfig.baseUrl;
    const api =  `${apiUrl + '/' + LocalStorageUtils.companyId}/integration/instance/${integrationValue.integration_instance_id}`;
    return this._httpClient.put(api, integrationValue).pipe(
      map((x: any) => x.result),
      catchError(err => {
        return of();
      }));
  }

  mergeIntegrationData(newIntegration: Integration, superSet: Integration) {
    const connection = {
      ...superSet.connection,
      ...newIntegration.connection
    }
    const sync_options = superSet.sync_options.map(option => {
      const integrationOption = newIntegration.sync_options.find(x => x.code === option.code);
      return {
        ...option,
        ...integrationOption,
        sub_sync_options: option.sub_sync_options
      }
    })
    const populatedData = {
      ...newIntegration,
      sync_options,
      connection,
      endpoints: superSet.endpoints
    }

    return populatedData;
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
