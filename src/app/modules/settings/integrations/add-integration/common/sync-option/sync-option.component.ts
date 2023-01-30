import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { IntegrationInstance, MappingOption, MappingValueOptions, SyncOption, Tab, ValuesList, ValuesListOptions, VALUE_OPTION_TYPE } from '../../../integration.types';
import { SyncOptionService } from './sync-option.service';

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
export abstract class SyncOptionComponent implements OnDestroy {
  integrationInstance: IntegrationInstance;
  syncOptions: SyncOption[];
  selectedPanel: SyncOption;
  selectedTab: Tab;
  selectedField: MappingOption;
  selectedChild: MappingOption;
  inputOptions: InputOption = {
    option: undefined,
    isActive: false,
    title: null,
    label: null,
    value: '',
    valueOption: undefined
  }
  validate = false;
  searchKeyword !: string;
  availableOptionsTypes = [];
  filteredAvailableOptionsTypes = [];
  valuesList: ValuesList[];
  selectedFieldParentIndex: Number | null | any;
  selectedFieldChildIndex: Number | null | any;

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
  goToField(field: MappingOption, parentIndex: Number, childIndex: Number | null = null): void {
    // if(field.code.length) {

      if(!field.children) {
        field.children = [];
      }
      this.selectedField = field;
      this.selectedFieldParentIndex = parentIndex;
      this.selectedFieldChildIndex = childIndex;
      console.log(this.selectedField)
      this.searchKeyword = '';
      this.loadSelectOptions();
    // }
  }

  /**
   * Set the active children.
   *
   * @param child Represents the child to be activated.
   */
  goToChild(child: MappingOption): void {
    // if(field.code.length) {
      this.selectedChild = child;
      this.loadSelectOptions();
    // }
  }

  /**
   * Reset the field selection.
   */
  resetFieldSelection(): void {
    this.selectedField = undefined;
    this.availableOptionsTypes = [];
    this.filteredAvailableOptionsTypes = [];
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

    this.filteredAvailableOptionsTypes = [ ...this.availableOptionsTypes ];

    console.log(this.availableOptionsTypes);
  }

  searchOptionValues() {
    const regexToMatch = new RegExp(`${ this.searchKeyword }`, "gi");
    
    if (this.searchKeyword) {
      this.filteredAvailableOptionsTypes = JSON.parse(JSON.stringify(this.availableOptionsTypes)).map(option => {
        try {
          option.valueList.values = option.valueList.values.filter(value => value.label.match(regexToMatch));
          return option;
        } catch (error) {
          return option;
        }
      });
    } else {
      this.filteredAvailableOptionsTypes = [ ...this.availableOptionsTypes ];
    }
  }

  /**
   * Toggles expansion of options.
   *
   * @param index Represents the index of available options
   */
  toggleOptionsExpansion(index: number): void {
    this.filteredAvailableOptionsTypes.forEach((option, i, options) => {
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

    if (this.selectedFieldChildIndex != null) {
      this.selectedTab.mapping_options[this.selectedFieldParentIndex].children[this.selectedFieldChildIndex] = {...this.selectedField};
    } else {
      this.selectedTab.mapping_options[this.selectedFieldParentIndex] =  {...this.selectedField};
    }

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
   * Add new mapping option.
   */
  addField(): void {
    const field: MappingOption = {
      code: "",
      label: "",
      type: "option",
      required: false,
      default_value: "",
      selected_value: {
          label: "Not Mapped",
          code: ""
      },
      value_options: [],
      children: []
    }
    this.selectedTab.mapping_options.push(field);
  }

  /**
   * Set the label and code of fields with the value user types in.
   *
   * @param field Represents the newly added field.
   */
  setFieldLabel(field: MappingOption): void {
    field.code = field.label;
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
  setChildrenLabel(child: MappingOption, field: MappingOption): void {
    for (let fieldChild of field.children) {
      if (child.label == fieldChild.code) {
        child.label = "";
        return;
      }
    }
    child.code = child.label;
  }
}
