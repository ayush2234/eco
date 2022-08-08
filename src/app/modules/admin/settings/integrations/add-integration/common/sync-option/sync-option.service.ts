/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, switchMap, map } from 'rxjs';
import { Integration, SelectOption } from '../../../integrations.types';

@Injectable({
    providedIn: 'root',
})
export class SyncOptionService {
    // Private
    private _selectedIntegration: BehaviorSubject<string | null> =
        new BehaviorSubject(null);
    private _wipIntegration: BehaviorSubject<Integration | null> =
        new BehaviorSubject(null);
    private _customerOptionsSelectOptions: BehaviorSubject<
        SelectOption[] | null
    > = new BehaviorSubject(null);
    private _customerGroupSelectOptions: BehaviorSubject<
        SelectOption[] | null
    > = new BehaviorSubject(null);
    private _existingCustomerSelectOptions: BehaviorSubject<
        SelectOption[] | null
    > = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    set wipIntegration(value: Integration) {
        this._wipIntegration.next(value);
    }

    get wipIntegration$(): Observable<Integration> {
        return this._wipIntegration.asObservable();
    }

    get selectedIntegration$(): Observable<Integration> {
        return this._selectedIntegration.asObservable().pipe(
            switchMap((id) =>
                of({
                    integrationId: 'd39c5f3f-26bd-440b-8f99-f95869dfa659',
                    erpId: 'd39c5f3f-26bd-440b-8f99-f95869dfa659',
                    name: 'Bunnings Marketlink',
                    icon: 'https://wordpress-631421-2579652.cloudwaysapps.com/wp-content/uploads/2022/07/25498408_1747271388901154_6198955593483881874_n.png',
                    description:
                        'Sync products, inventory, tracking and more to and from Bunnings Marketlink',
                    isCustom: false,
                    connectionForm: 'woocommerce',
                    forceTestConnection: true,
                    syncOptions: [
                        {
                            key: 'products',
                            name: 'Products',
                            form: 'erpMaropostWooCommerce',
                            attributes: [],
                            isActive: true,
                        },
                        {
                            key: 'inventory',
                            name: 'Inventory',
                            form: 'erpMaropost',
                            attributes: [
                                {
                                    setting: 'take_stock_from',
                                    fieldType: 'selectFromErp',
                                    erpValuesList:
                                        'api/v1/erpInstallId/warehouses',
                                    installationValuesList: '',
                                    additionalOptions: [
                                        {
                                            option: 'take_from_available',
                                            label: 'Take from AvailableSellQauntity',
                                            isDefault: true,
                                        },
                                    ],
                                },
                            ],
                            isActive: false,
                        },
                        {
                            key: 'orders',
                            name: 'Orders',
                            form: 'erpMaropost',
                            attributes: [
                                {
                                    setting: 'customer_options',
                                    fieldType: 'selectFromAdditionalOptions',
                                    erpValuesList: '',
                                    installationValuesList: '',
                                    additionalOptions: [
                                        {
                                            option: 'create_unique_customer',
                                            label: 'Create unique customer for each order',
                                            isDefault: true,
                                        },
                                        {
                                            option: 'link_to_existing',
                                            label: 'Link to existing username',
                                            isDefault: false,
                                        },
                                    ],
                                },
                                {
                                    setting: 'existing_customer',
                                    fieldType: 'selectFromErp',
                                    erpValuesList:
                                        'api/v1/erpInstallId/customers',
                                    installationValuesList: '',
                                    dependency: 'link_to_existing',
                                    additionalOptions: [],
                                },
                                {
                                    setting: 'customer_group',
                                    fieldType: 'selectFromErp',
                                    erpValuesList:
                                        'api/v1/erpInstallId/pricegroups',
                                    installationValuesList: '',
                                    dependency: 'create_unique_customer',
                                    additionalOptions: [],
                                },
                                {
                                    setting: 'order_status',
                                    fieldType: 'selectFromAdditionalOptions',
                                    erpValuesList: '',
                                    installationValuesList: '',
                                    additionalOptions: [
                                        {
                                            option: 'New',
                                            label: 'New',
                                            isDefault: 'false',
                                        },
                                        {
                                            option: 'Pick',
                                            label: 'Pick',
                                            isDefault: 'true',
                                        },
                                        {
                                            option: 'Pack',
                                            label: 'Pack',
                                            isDefault: 'false',
                                        },
                                        {
                                            option: 'Pending Dispatch',
                                            label: 'Pending Dispatch',
                                            isDefault: 'false',
                                        },
                                        {
                                            option: 'On Hold',
                                            label: 'On Hold',
                                            isDefault: 'false',
                                        },
                                        {
                                            option: 'Dispatched',
                                            label: 'Dispatched',
                                            isDefault: 'false',
                                        },
                                    ],
                                },
                                {
                                    setting: 'ship_method_mapping',
                                    fieldType: 'mapping',
                                    source: 'Source',
                                    destination: 'Destination',
                                    erpValuesList:
                                        'api/v1/erpInstallId/shippingMethods',
                                    installationValuesList:
                                        'api/v1/installationId/shippingMethods',
                                    additionalOptions: '',
                                },
                                {
                                    setting: 'payment_method_mapping',
                                    fieldType: 'mapping',
                                    source: 'installation',
                                    destination: 'erp',
                                    erpValuesList:
                                        'api/v1/erpInstallId/paymentMethods',
                                    installationValuesList:
                                        'api/v1/installationId/paymentMethods',
                                    additionalOptions: [
                                        {
                                            option: 'do_not_mark_as_paid',
                                            label: 'Do not mark as paid',
                                            isDefault: 'true',
                                        },
                                    ],
                                },
                            ],
                            isActive: false,
                        },
                        {
                            key: 'tracking',
                            name: 'Tracking',
                            form: 'erpMaropost',
                            attributes: [
                                {
                                    setting: 'carrier_mapping',
                                    fieldType: 'mapping',
                                    source: 'erp',
                                    destination: 'installation',
                                    erpValuesList:
                                        'api/v1/erpInstallId/ShippingServices',
                                    installationValuesList:
                                        'api/v1/installationId/Carriers',
                                    additionalOptions: '',
                                },
                            ],
                            isActive: false,
                        },
                    ],
                })
            ),
            tap((integration) => {
                this._wipIntegration.next(integration);
            })
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set selected integration
     */
    setSelectedIntegration(value: string): void {
        this._selectedIntegration.next(value);
    }

    /**
     * Get select options
     */
    getSelectOptions(key: string, api: string): Observable<SelectOption[]> {
        return this._httpClient.get(api).pipe(
            map((res: any) => {
                switch (key) {
                    case 'take_stock_from':
                        const warehouses = res?.wareHouse?.reduce(
                            (arr, value) =>
                                value
                                    ? [
                                          ...arr,
                                          {
                                              option: value.wareHouseID,
                                              label: value.wareHouseName,
                                          },
                                      ]
                                    : [...arr],
                            []
                        );

                        return warehouses;
                    default:
                        return res;
                }
            })
        );
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
