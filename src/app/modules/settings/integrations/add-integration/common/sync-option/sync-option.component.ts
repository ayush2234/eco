import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { Integration, IntegrationInstance, MappingOption, SyncOption, Tab, ValuesList, ValuesListOptions, VALUE_OPTION_TYPE } from '../../../integration.types';
import { SyncOptionService } from './sync-option.service';

interface InputOption {
  option: SyncOption;
  isActive: boolean;
  title: string;
  label: string;
  value: string;
}

@Component({
  selector: 'eco-sync-option',
  templateUrl: './sync-option.component.html',
  encapsulation: ViewEncapsulation.None,
})
export abstract class SyncOptionComponent implements OnDestroy {
  integrationInstance: IntegrationInstance;
  syncOptions: SyncOption[];
  selectedPanel: SyncOption;
  selectedTab: Tab;
  selectedField: MappingOption;
  availableOptions: ValuesList[];
  inputOptions: InputOption = {
    option: undefined,
    isActive: false,
    title: null,
    label: null,
    value: ''
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
    this.availableOptions = undefined;
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
    // Handling values_list option only at the moment.
    // let loadOptionObservables: Observable<ValuesList>[] = [];
    // const integrationEndpoint = '/' + LocalStorageUtils.companyId + '/integrationInstance/' + this.integrationInstance.instance_id;

    this.availableOptionsTypes = [];
    this.selectedField.value_options.forEach((option) => {
      switch(option.value_option_type) {
        case VALUE_OPTION_TYPE.values_list || VALUE_OPTION_TYPE.attribute:
          // const valuesListEndpoint = '/values_list?origin=' + option.values_list_origin;
          const valueList = this.valuesList.find(vl => vl.code === option.values_list)
          this.availableOptionsTypes.push({
            value_option: option,
            valueList
          })
          break;
        case VALUE_OPTION_TYPE.text_input:
          
          break;
        case VALUE_OPTION_TYPE.decimal_input:
          
          break;
        default:
          break;
      }
    });

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
   * @param title Represents the title of view.
   */
  toggleInputOption(title?: string): void {
    this.inputOptions = {
      ...this.inputOptions,
      isActive: !this.inputOptions.isActive,
      title,
      value: ''
    }
  }

  setInputValue(): void {
    if(this.inputOptions.value.length) {
      this.selectOption({ label: this.inputOptions.value, code: this.inputOptions.value })
    }

    this.toggleInputOption();
  }

  toggleMappingToDo(): void {
    this.validate = !this.validate;
  }

  addChildren(): void {
    const child: MappingOption = {
      label: '',
      code: '',
      type: this.selectedField.type,
      required: false,
      selected_value: { code: '', label: 'Not Mapped' },
      value_options: this.selectedField.value_options
    }
    this.selectedField.children.push(child)
  }

  setChildrenLabel(child: MappingOption): void {
    child.code = child.label;
  }
}
