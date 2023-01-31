import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { appConfig } from 'app/core/config/app.config';
import { SyncOptionService } from './sync-option.service';
import { IntegrationInstance, integrationInstanceConnection, IntegrationValue, MappingOption, MappingValueOptions, SyncOption, Tab, ValuesList, ValuesListOptions, VALUE_OPTION_TYPE } from '../../../integration.types';

interface InputOption {
  option: SyncOption;
  isActive: boolean;
  title: string;
  label: string;
  value: string;
  valueOption: MappingValueOptions
}

@Component({
  selector: 'eco-sync-option',
  templateUrl: './sync-option.component.html',
  encapsulation: ViewEncapsulation.None,
})
export abstract class SyncOptionComponent implements OnDestroy, OnInit {
  integrationInstance: IntegrationInstance;
  private _config = appConfig;
  api = this._config?.apiConfig?.baseUrl;
  syncOptions: SyncOption[];
  selectedPanel: SyncOption;
  selectedTab: Tab;
  selectedField: MappingOption;
  integrationValue: IntegrationValue; 
  integrationInstanceConnection: integrationInstanceConnection;
  inputOptions: InputOption = {
    option: undefined,
    isActive: false,
    title: null,
    label: null,
    value: '',
    valueOption: undefined
  }
  validate = false;
  availableOptionsTypes = [];
  valuesList: ValuesList[];

  protected _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public _syncOptionService: SyncOptionService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(){
    this.integrationInstanceConnection = {
      store_url: "https://onesixeightlondon.com.au",
      consumer_key: "ck-5262842efed5eede****",
      consumer_secret: "cs-58de5de5eg5w5ww5g5c****"
    }
    this.integrationValue = {
      source_instance_id: "1ed9a335-4cde-6932-ae80-0605e1fd6890",
      integration_id: "1ed1f116-8527-6bfa-93c1-0605e1fd6890",
      name: "NewMappingCreateTest123",
      active_status: "Y",
      is_custom: "N",
      connection_status: "Y",
      last_connection_time:"",
      connection: this.integrationInstanceConnection,
      sync_options: this.syncOptions
    }

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

  private setWipIntegration(): void {
    this._syncOptionService.wipIntegration = {
      ...this.integrationInstance
    };
  }

  /**
   * Activate panel
   */
  activatePanel(): void {
    this.selectedPanel.is_activated = true;
    const panelIndex = this.integrationInstance.integration.sync_options.findIndex(x => x.code === this.selectedPanel.code);
    this.integrationInstance.integration.sync_options[panelIndex] = {...this.selectedPanel};
    this.setWipIntegration();
  }

  /**
   * Set the active option tab.
   *
   * @param tab Represents the tab to be activated.
   */
  goToTab(tab: Tab): void {
    this.selectedTab = tab;
    this.resetFieldSelection();
  }

  /**
   * Set the active field.
   *
   * @param field Represents the field to be activated.
   */
  goToField(field: MappingOption): void {
    if(field.code.length) {

      if(!field.children) {
        field.children = [];
      }
      this.selectedField = field;
      console.log(this.selectedField)
      this.loadSelectOptions();
    }
  }

  /**
   * Reset the field selection.
   */
  resetFieldSelection(): void {
    this.selectedField = undefined;
    this.availableOptionsTypes = [];
    if(this.validate) {
      this.toggleMappingToDo();
    }
  }

  /**
   * Returns true if option is independent or meets the condition and false otherwise.
   * 
   * @param option Represents the sync option.
   * @returns True if option is independent or meets the condition and false otherwise.
   */
  isConditionSatisfied(option: MappingOption): boolean {
    const mappingRequiredCondition = this.validate === false ? true :
      option.selected_value.code === '' ? true : false;
    if(option.display_conditions) {
      const splitedCondition = option.display_conditions.split('==').map(x => x.trim());
      if(splitedCondition.length === 2) {
        const code = splitedCondition[0];
        const value = splitedCondition[1];
        const dependencyField = this.checkCondition(code);
        if(dependencyField !== null) {
          return dependencyField.selected_value.code === value && mappingRequiredCondition;
        }
      }

      return false;
    } else {
      return true && mappingRequiredCondition;
    }
  }

  /**
   * Returns the dependecy field.
   *
   * @param code Represents the code of dependency field.
   * @returns The dependecy field
   */
  checkCondition(code: string): MappingOption | null {
    let option: MappingOption | null = null;
    this.selectedPanel.sub_sync_options.forEach(tab => {
      tab.mapping_options.forEach(mapping => {
        if(option === null && mapping.code === code) {
          option = {...mapping};
        }
      });
    })
    return option;
  }

  /**
   * Set default tab.
   */
  setDefaultTab(): void {
    this.goToTab(this.selectedPanel.sub_sync_options[0]);
  }

  /**
   * Load select options
   */
  loadSelectOptions(): void {
    this.availableOptionsTypes = [];
    this.selectedField.value_options.forEach((option) => {
      switch(option.value_option_type) {
        case VALUE_OPTION_TYPE.values_list:
          // const valuesListEndpoint = '/values_list?origin=' + option.values_list_origin;
          const valueList = this.valuesList.find(vl => vl.code === option.values_list)
          this.availableOptionsTypes.push({
            value_option: option,
            valueList,
            isExpanded: this.availableOptionsTypes.length ? false : true
          })
          break;
        case VALUE_OPTION_TYPE.text_input: 
        case VALUE_OPTION_TYPE.decimal_input:
          this.availableOptionsTypes.push({
            value_option: option,
            valueList: [],
            isExpanded: false
          })
          break;
        case VALUE_OPTION_TYPE.categories:
          // TODO: Handle categories here.
          break;
        default:
          break;
      }
    });

    console.log(this.availableOptionsTypes);
  }

  /**
   * Toggles expansion of options.
   *
   * @param index Represents the index of available options
   */
  toggleOptionsExpansion(index: number): void {
    this.availableOptionsTypes.forEach((option, i, options) => {
      if(index === i) {
        options[i].isExpanded = !options[i].isExpanded;
      }
    })
    console.log(this.availableOptionsTypes);
  }

  /**
   * Set selected value.
   *
   * @param selection Represents the selected value option.
   */
  selectOption(selection: ValuesListOptions): void {
    this.selectedField = {
      ...this.selectedField,
      selected_value: {...selection}
    }

    this.selectedTab.mapping_options.forEach((field, fieldIndex, fieldArr) => {
      if(field.code === this.selectedField.code) {
        fieldArr[fieldIndex] = {...this.selectedField};
      }
      if(field.children) {
        field.children.forEach((child, childIndex, childArr) => {
          if(child.code === this.selectedField.code) {
            childArr[childIndex] = {...this.selectedField};
          }
        });
      }
    })

    const tabIndex = this.selectedPanel.sub_sync_options.findIndex(x => x.code === this.selectedTab.code);
    if(tabIndex !== -1) {
      this.selectedPanel.sub_sync_options[tabIndex] = {...this.selectedTab};
    }
  }

  /**
   * Toggle the input option view.
   *
   * @param valueOption Represents the value option.
   * @param title Represents the title of view.
   */
  toggleInputOption(valueOption?: MappingValueOptions, title?: string): void {
    this.inputOptions = {
      ...this.inputOptions,
      isActive: !this.inputOptions.isActive,
      title,
      value: '',
      valueOption
    }
  }

  /**
   * Set the input value of options to the associated field.
   */
  setInputValue(): void {
    if(this.inputOptions.value.length) {
      this.selectOption({ label: this.inputOptions.value, code: this.inputOptions.value })
    }

    this.toggleInputOption();
  }

  /**
   * Toggles the validation of fields.
   */
  toggleMappingToDo(): void {
    this.validate = !this.validate;
  }

  /**
   * Add children to fields.
   */
  addChildren(): void {
    const child: MappingOption = {
      label: '',
      code: '',
      type: this.selectedField.type,
      required: false,
      selected_value: { code: '', label: 'Not Mapped' },
      value_options: this.selectedField.child_attribute_values ?
        this.selectedField.value_options.concat(this.selectedField.child_attribute_values) :
        this.selectedField.value_options
    }
    this.selectedField.children.push(child);
  }

  /**
   * Set the label and code of children with the value user types in.
   *
   * @param child Represents the newly added child.
   */
  setChildrenLabel(child: MappingOption): void {
    child.code = child.label;
  }
  saveIntegration(){
    this._syncOptionService.createIntegration(this.integrationValue);
  }
}
