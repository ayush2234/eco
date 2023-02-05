import { moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { PortalBridgeService } from 'app/layout/common/eco-drawer/portal-bridge.service';
import { Subject, takeUntil } from 'rxjs';
import { IntegrationService } from '../integration.service';
import { Integration, IntegrationSyncForm, ValuesList } from '../integration.types';
import * as JSONschema from './sync-option-form.schema.json';
import Ajv from "ajv"


const ajv = new Ajv();
const validateJSON = ajv.compile(JSONschema);
@Component({
    selector: 'eco-add-integration-form',
    templateUrl: './add-integration-form.component.html',
    styleUrls: ['./add-integration-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntegrationFormComponent implements OnInit, OnChanges {

    @ViewChild(CdkPortal, { static: true }) portalContent: CdkPortal;
    @ViewChild('drawer') drawer: MatDrawer;
    @Output() cancel = new EventEmitter();
    drawerMode: 'over' | 'side' = 'side';
    jsonDrawerOpened: boolean = false;
    drawerOpened: boolean = true;
    fuseDrawerOpened: boolean = true;
    formObjectStringified!: string;

    @Input() isOpen = true;
    @Input() selectedIntegration: Integration;
    @ViewChildren('mappingOptionItem') mappingOptionItems: QueryList<any>;
    formObj: IntegrationSyncForm = {
        endpoints: [],
        connections: {
            code: "",
            label: "",
            description: "",
            connection_instructions: "",
            fields: []
        },
        sync_options: []
    };

    panels: any[] = [];
    valueList: ValuesList;
    selectedPanel: any;
    selectedPanelIndex: number = 0;
    selectedTab;
    selectedSyncOptionTab: number = -1;
    currentDraggingMappingOptionIndex: any = null;
    protected _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _portalBridge: PortalBridgeService,
        private _changeDetector: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _integrationService: IntegrationService
    ) { }

    ngOnInit(): void {
        this.getIntegrationFormValue();
        this.getValueList();
        this._portalBridge.setPortal(this.portalContent);
        this.goToTab('endpoints');
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }
                // Mark for check
                this._changeDetector.markForCheck();
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.isOpen.currentValue) {
            this.formObj = {
                endpoints: [],
                connections: {
                    code: "",
                    label: "",
                    description: "",
                    connection_instructions: "",
                    fields: []
                },
                sync_options: []
            }
            this.goToTab('endpoints');
        }
    }

    onExpandMappingOption(event, index: number) {
        const target = event.target;
        this._changeDetector.detectChanges();
        this.mappingOptionItems.map((element: any) => {
            if (element.nativeElement.contains(target)) {
                element.nativeElement.classList.toggle('collapsed');
            }
        })
    }

    /**
     * FuseDrawer openedChanged
     *
     */
    openedChanged(fuseDrawer): any {
        this.isOpen ? null : fuseDrawer.close();
        !fuseDrawer?.opened && this.closeDrawer();
    }

    closeDrawer() {
        this.isOpen = false;
        this.cancel.emit();
    }

    goToTab(code) {
        this.selectedTab = code;
        // Close the drawer on 'over' mode
        this._changeDetector.detectChanges();
        if (this.drawerMode === 'over' && this.drawer) {
            this.drawer.close();
        }
    }

    /**
     * Endpoints Functions
     */
    addField() {
        switch (this.selectedTab) {
            case 'endpoints':
                this.formObj.endpoints.push({
                    "origin": "source",
                    "type": "values_list"
                })
                break;

            case 'connections':
                this.formObj.connections.fields.push({
                    "code": "",
                    "label": "",
                    "type": "",
                    "needs_auth_url": "",
                    "description": ""
                });
                break;

            default:
                break;
        }
    }

    removeField(index) {
        switch (this.selectedTab) {
            case 'endpoints':
                this.formObj.endpoints.splice(index, 1);
                break;

            case 'connections':
                this.formObj[this.selectedTab].fields.splice(index, 1);
                break;

            case 'sync_options':
                this.formObj[this.selectedTab].splice(index, 1);
                const length = this.formObj[this.selectedTab].length;
                if (length > 0) {
                    if (!this.formObj[this.selectedTab][this.selectedPanelIndex]) {
                        this.selectedPanelIndex -= 1;
                    }
                } else {
                    this.selectedTab = "connections";
                }
                break;

            default:
                break;
        }
    }

    addSyncOption() {
        this.formObj.sync_options.push({
            code: "",
            label: "",
            description: "",
            sub_sync_options: []
        });
        this.goToPanel(this.formObj.sync_options.length - 1);
    }

    /**
     * Navigate to the panel
     *
     * @param code
     */
    goToPanel(panelIndex: number): void {
        this.selectedPanelIndex = panelIndex;
        this.selectedTab = "sync_options";
        this.selectedSyncOptionTab = -1;
        // Close the drawer on 'over' mode
        this._changeDetector.detectChanges();
        if (this.drawerMode === 'over' && this.drawer) {
            this.drawer.close();
        }
    }

    addSyncOptionsTab(event) {
        if (event.target.value != '') {
            this.formObj.sync_options[this.selectedPanelIndex].sub_sync_options.push({
                code: event.target.value.trim().toLowerCase().replace(' ', '_'),
                label: event.target.value.trim(),
                mapping_options: []
            });
            if (this.selectedSyncOptionTab == -1) {
                this.selectedSyncOptionTab = this.formObj.sync_options[this.selectedPanelIndex].sub_sync_options.length - 1;
            }
        }
    }

    selectSyncOptionTab(tabIndex) {
        this.selectedSyncOptionTab = tabIndex;
    }

    addMappingOption() {
        this.formObj.sync_options[this.selectedPanelIndex].sub_sync_options[this.selectedSyncOptionTab].mapping_options.push({
            code: "",
            label: "",
            description: "",
            type: "",
            required: false,
            is_validated: false,
            is_hidden: false,
            display_conditions: "",
            value_options: [],
            child_attribute_values: []
        });
        this._changeDetector.detectChanges();
    }

    removeMappingOption(index: number) {
        this.formObj.sync_options[this.selectedPanelIndex].sub_sync_options[this.selectedSyncOptionTab].mapping_options.splice(index, 1);
        this._changeDetector.detectChanges();
    }

    addValueOption(mappingOptionIndex: number) {
        this.formObj.sync_options[this.selectedPanelIndex].sub_sync_options[this.selectedSyncOptionTab].mapping_options[mappingOptionIndex].value_options.push({
            value_option_type: "",
            value_option_label: "",
            values_list_option: "",
            values_list: "",
            is_child: true,
        });
    }

    removeValuesOption(mappingOptionIndex: number, valueIndex: number) {
        this.formObj.sync_options[this.selectedPanelIndex].sub_sync_options[this.selectedSyncOptionTab].mapping_options[mappingOptionIndex].value_options.splice(valueIndex, 1);
    }

    /**
    * Drag end event handler
    *
    * @param event
    */
    fieldDropped(event) {
        switch (this.selectedTab) {
            case 'endpoints':
                moveItemInArray(this.formObj.endpoints, event.previousIndex, event.currentIndex);
                break;

            case 'connections':
                moveItemInArray(this.formObj.connections.fields, event.previousIndex, event.currentIndex);
                break;

            case 'sync_options':
                if (typeof this.currentDraggingMappingOptionIndex == "number") {
                    moveItemInArray(this.formObj.sync_options[this.selectedPanelIndex].sub_sync_options[this.selectedSyncOptionTab].mapping_options[this.currentDraggingMappingOptionIndex].value_options, event.previousIndex, event.currentIndex);
                    this.currentDraggingMappingOptionIndex = null;
                } else {
                    moveItemInArray(this.formObj.sync_options[this.selectedPanelIndex].sub_sync_options[this.selectedSyncOptionTab].mapping_options, event.previousIndex, event.currentIndex);
                }
                break;

            default:
                break;
        }
    }

    /**
    * Drag start event handler
    *
    * @param mappingOptionIndex
    */
    mappingOptionDragStart(mappingOptionIndex) {
        console.log('mappingOptionIndex', mappingOptionIndex);
        this.currentDraggingMappingOptionIndex = mappingOptionIndex;
    }

    /**
    * ViewJSON button function
    *
    */
    async onViewJSON() {
        this.jsonDrawerOpened = true;
        const payload = await this.createPayload();
        this.formObjectStringified = JSON.stringify(payload, null, 4);
    }

    /**
    * Create form from JSON
    *
    */
    importJSON() {
        if (this.formObjectStringified && this.formObjectStringified.length > 0) {
            try {
                const json = JSON.parse(this.formObjectStringified);
                if (json && Object.keys(json).length > 0) {
                    const valid = validateJSON(JSON.parse(this.formObjectStringified));
                    if (!valid) {
                        console.log(validateJSON.errors)
                        return;
                    }
                    this.formObj = JSON.parse(this.formObjectStringified);
                    this.mergeValueOptionList();
                    this.selectedPanel = null;
                    this.selectedPanelIndex = 0;
                    this.selectedTab = null;
                    this.selectedSyncOptionTab = -1;
                    this.currentDraggingMappingOptionIndex = null;
                    this.jsonDrawerOpened = false;
                    this.goToTab('endpoints');
                    this._changeDetector.detectChanges();
                } else {
                    console.log('You are trying to parse Invalid JSON.');
                }
            } catch (error) {
                console.log('You are trying to parse Invalid JSON.', error);
            }
        }
    }

    /**
    * Beautify Sync Option Form JSON
    *
    */
    formatJOSN() {
        try {
            this.formObjectStringified = JSON.stringify(JSON.parse(this.formObjectStringified), null, 4);
        } catch (error) {
            console.log('invalid JSON');
        }
    }

    /**
    * Get Sync Options JSON for given Integration ID
    *
    */
    getIntegrationFormValue() {
        this._integrationService.getIntegrationSyncForm(this.selectedIntegration.integration_id).pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
            if (result?.result && Object.keys(result?.result).length > 0) {
                this.formObj = result?.result;
                this.mergeValueOptionList();
            }
        })
    }

    /**
    * Get Value list to fillup Dropdown options.
    *
    */
    getValueList() {
        this._integrationService.getIntegrationSyncFormValueList(this.selectedIntegration.integration_id).pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
            if (result?.result) {
                this.valueList = result?.result;
            }
        })
    }

    /**
    * Save Sync Option Form
    *
    */
    async saveIntegrationSyncForm() {
        const payload = await this.createPayload();
        this._integrationService.updateIntegrationSyncForm(this.selectedIntegration.integration_id, payload).pipe(takeUntil(this._unsubscribeAll)).subscribe()
    }

    /**
    * Prepare Payload for Save Form
    *
    */
    createPayload() {
        const payload = JSON.parse(JSON.stringify(this.formObj));
        payload.sync_options.map(option => {
            if (!option.code || option.code == '' || option.code == null || option.code == undefined) {
                option.code = option.label.toLowerCase();
            }

            // Make value_option separate from child_attribute_values based on is_child Property
            option.sub_sync_options.map(subOption => {
                subOption.mapping_options.map(mapOption => {
                    mapOption['child_attribute_values'] = [];
                    mapOption.value_options = mapOption.value_options.map(valueOption => {
                        if (valueOption.is_child == true) {
                            mapOption['child_attribute_values'].push(valueOption);
                            return null;
                        }
                        return valueOption;
                    })
                    mapOption.value_options = mapOption.value_options.filter(item => item !== null);
                })
            })
        })
        return payload;
    }

    /**
     * Reset Value list on dropdown value change
     *
     * @param valueIndex
     * @param mappingIndex
     */
    updateValuesList(valueOptionType, valueIndex, mappingIndex) {
        if (valueOptionType != 'values_list') {
            this.resetValuesList(valueIndex, mappingIndex);
        }
    }

    /**
     * Reset Value list on dropdown value change
     *
     * @param valueIndex
     * @param mappingIndex
     */
    resetValuesList(valueIndex, mappingIndex) {
        this.formObj[this.selectedTab][this.selectedPanelIndex]['sub_sync_options'][this.selectedSyncOptionTab].mapping_options[mappingIndex].value_options[valueIndex]['values_list'] = "";
    }


    /**
     * Reset Auth URL on dropdown value change
     *
     * @param fieldType
     * @param fieldIndex
     */
    resetAuthURL(fieldType, fieldIndex) {
        if (fieldType != 'oauth') {
            console.log('==>', this.selectedTab, this.selectedPanelIndex);
            this.formObj[this.selectedTab].fields[fieldIndex].needs_auth_url = "";
        }
    }

    /**
     * Merge child_attribute_values & value_options into single array
     *
     */
    mergeValueOptionList() {
        this.formObj.sync_options.map(option => {
            option.sub_sync_options.map(subOption => {
                subOption.mapping_options.map(mapOption => {
                    mapOption.value_options = JSON.parse(JSON.stringify([...(mapOption?.child_attribute_values || []), ...mapOption.value_options]))
                    mapOption['child_attribute_values'] = [];
                })
            })
        })
    }

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
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this.portalContent.detach();
    }


}
