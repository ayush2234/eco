import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { appConfig } from 'app/core/config/app.config';
import { SyncOptionService } from './sync-option.service';
import { IntegrationInstance, integrationInstanceConnection, IntegrationValue, MappedIntegration, MappedOptions, MappedSyncOption, MappedTab, MappingOption, MappingValueOptions, SyncOption, Tab, ValuesList, ValuesListOptions, VALUE_OPTION_TYPE } from '../../../integration.types';

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
  integrationInstanceConnection: integrationInstanceConnection;
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
  valuesList: ValuesList[] = [];
  selectedFieldParentIndex: Number | null | any;
  selectedFieldChildIndex: Number | null | any;
  newInsertedFieldChildren = {};
  mappedIntegration: MappedIntegration;
  showHidden = false;

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

  ngOnInit(){ }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  setWipIntegration(): void {
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
    let childrenCondition = false;
    option.children?.forEach((child) => {
      if(!child.selected_value || child.selected_value.code == '') {
        childrenCondition = true;
      }
    })

    const childMatter = this.validate === false ? true : childrenCondition;
    const mappingRequiredCondition = this.validate === false ? true :
      ((!option.selected_value || option.selected_value?.code == '') ? true : false);

    const fieldDisplay = mappingRequiredCondition || childMatter;
    if(option.display_conditions && option.display_conditions.length) {
      const splitedCondition = option.display_conditions.split('==').map(x => x.trim());
      if(splitedCondition.length === 2) {
        const code = splitedCondition[0];
        const value = splitedCondition[1];
        const dependencyField = this.checkCondition(code);
        if(dependencyField !== null) {
          return dependencyField.selected_value?.code === value && fieldDisplay && option.is_hidden === false;
        }
      }

      return false;
    } else {
      return fieldDisplay && option.is_hidden === false ;
    }
  }

  showHiddenFields(): void {
    this.integrationInstance.integration.sync_options.forEach(syncOption => {
      syncOption.sub_sync_options.forEach(subOption => {
        subOption.mapping_options.forEach((mappingOption, index, array) => {
          if(mappingOption.is_hidden) {
            array[index].is_hidden = false;
          }
        })
      })
    })
    this.showHidden = true;
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
          // const valuesListEndpoint = '/values_list?origin option.values_list_origin;
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
  selectOption(selection: ValuesListOptions, valueOption: MappingValueOptions): void {
    this.selectedField = {
      ...this.selectedField,
      selected_value: {...selection, value_option: valueOption}
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

    this.updateMappedSyncOptions();
  }

  mapChildren() {
    this.integrationInstance?.integration.sync_options.forEach((syncOption, syncOptionIndex) => {
      syncOption.sub_sync_options.forEach((subOption, subOptionIndex) => {
        subOption.mapping_options.forEach((field, fieldIndex) => {
          if(field.child_attribute_values && field.child_attribute_values.length) {
            field.child_attribute_values.forEach(child => {
              if(!this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].children) {
                this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].children = [];
              }
              const valueList = this.valuesList.find(x => x.code === child.values_list);
              valueList?.values.forEach(value => {
                const childExist = this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex]
                .mapping_options[fieldIndex].children.findIndex(x => x.code === value?.code);
                if(childExist === -1) {
                  this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].children.push({
                    label: value?.label,
                    code: value.code,
                    type: child.value_type,
                    required: false,
                    selected_value: {label: 'Not Mapped', code: ''},
                    value_options: this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].value_options
                  })
                }
              })
            })
          }
        })
      })
    })
  }

  mapOptionsToForm(): void {
    this.mapChildren();
    this.mappedIntegration?.sync_options.forEach(syncOption => {
      syncOption.sub_sync_options.forEach(subOption => {
        const syncOptionIndex = this.integrationInstance.integration.sync_options.findIndex(x => x.code === syncOption.code);
        const subOptionIndex = this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options.findIndex(x => x.code === subOption.code);
        subOption.mapped_options.forEach(mappedOption => {
          const fieldIndex = this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options
            .findIndex(x => x.code === mappedOption.mapping_code);
          if(fieldIndex !== -1) {
            this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].selected_value = {
              label: mappedOption.mapped_label,
              code: mappedOption.mapped_code
            }

            const field = this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex];
            if(field.child_attribute_values && field.child_attribute_values.length) {
              field.child_attribute_values.forEach(child => {
                if(!this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].children) {
                  this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].children = [];
                }
                const valueList = this.valuesList.find(x => x.code === child.values_list);
                valueList?.values.forEach(value => {
                  const childExist = this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex]
                  .mapping_options[fieldIndex].children.findIndex(x => x.code === value?.code);
                  if(childExist === -1) {
                    this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].children.push({
                      label: value?.label,
                      code: value.code,
                      type: child.value_type,
                      required: false,
                      selected_value: {label: 'Not Mapped', code: ''},
                      value_options: this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].value_options
                    })
                  } else {
                    this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].children[childExist] = {
                      label: value?.label,
                      code: value.code,
                      type: child.value_type,
                      required: false,
                      selected_value: {label: 'Not Mapped', code: ''},
                      value_options: this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].value_options
                    }
                  }
                })
              })
            }

            if(mappedOption.mapping) {
              mappedOption.mapping.forEach(mapping => {
                const children = this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].children;
                const childIndex = this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex]
                  .mapping_options[fieldIndex].children?.findIndex(x => x.code === mapping.mapping_code);
                if(childIndex !== undefined && childIndex !== -1) {
                  this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].children[childIndex] = {
                    ...this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].children[childIndex],
                    selected_value: {label: mapping.mapped_label, code: mapping.mapped_code}
                  }
                } else if(children && children.length) {
                  this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].children.push({
                    label: mapping.mapping_label,
                    code: mapping.mapping_code,
                    type: mapping.mapping_type,
                    required: false,
                    selected_value: {label: mapping.mapped_label, code: mapping.mapped_code},
                    value_options: this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].value_options
                  })
                } else {
                  this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].children = [{
                    label: mapping.mapping_label,
                    code: mapping.mapping_code,
                    type: mapping.mapping_type,
                    required: false,
                    selected_value: {label: mapping.mapped_label, code: mapping.mapped_code},
                    value_options: this.integrationInstance.integration.sync_options[syncOptionIndex].sub_sync_options[subOptionIndex].mapping_options[fieldIndex].value_options
                  }]
                }
              })
            }
          }
        })
      })
    })
  }

  updateMappedSyncOptions() {
    const oSync = this.integrationInstance.integration.sync_options.map(
      syncOption => {
        const sync = this.integrationInstance.integration.sync_options.find(
          y => y.code === syncOption.code
        );
        return {
          code: syncOption.code,
          is_active: sync.is_active != undefined ? sync.is_active : false,
          is_activated:
            sync.is_activated != undefined ? sync.is_activated : false,
        sub_sync_options: syncOption.sub_sync_options.map(subOption => {
          return {
            code: subOption.code,
            mapped_options: subOption.mapping_options.map(mappingOption => {
              if(mappingOption.selected_value) {
                const fieldObj = {
                  mapped_code: mappingOption.selected_value.code,
                  mapped_label: mappingOption.selected_value.label,
                  mapped_type: mappingOption.selected_value.value_option?.value_type == undefined ? '':mappingOption.selected_value.value_options?.value_type,
                  mapping_code: mappingOption.code,
                  mapping_type: mappingOption.type,
                  mapping_label: mappingOption.label,
                  mapped_origin: mappingOption.selected_value.value_option?.values_list_origin,
                  mapping: mappingOption.children?.map(child => {
                    if(child.selected_value && child.selected_value.code !== '') {
                      return {
                        mapped_code: child.selected_value.code,
                        mapped_label: child.selected_value.label,
                        mapped_type: child.selected_value.value_option?.value_type,
                        mapping_code: child.code,
                        mapping_type: child.type,
                        mapping_label: child.label
                      }
                    } else {
                      return undefined
                    }
                  }).filter(x => x)
                }
                if(fieldObj.mapped_type === 'static') {
                  delete fieldObj.mapped_origin;
                }
                return fieldObj;
              } else {
                return undefined
              }
            }).filter(x => x)
          }
        }).filter(x => x.mapped_options.length)
      }
    })
    this.mappedIntegration.sync_options = [...oSync];
  }

  initMappedIntegration() {
    this.mappedIntegration = {
      source_instance_id: "f8d13159-70dd-4071-8c72-621ff27a9999",
      connection: {} as any,
      integration_id: this.integrationInstance.integration_id,
      active_status: "Y",
      is_custom: "N",
      name: "",
      connection_status: true,
      last_connection_time:"",
      sync_options: this.syncOptions.map(x => {
        return {
          code: x.code,
          is_active: x.is_active,
          is_activated: x.is_activated,
          sub_sync_options: []
        }
      })
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
      this.selectOption({ label: this.inputOptions.value, code: this.inputOptions.value }, this.inputOptions.valueOption)
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
   *  For setting an object for edit and delete action display in FE.
   */

  setNewInsertedParent(parentIndex) {
    if (this.newInsertedFieldChildren[this.selectedPanel.code]) {
      if (this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code]) {
        if (this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][parentIndex]) {
          return;
        } else {
          this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][parentIndex] = {
            editable: false,
            children: []
          }
        }
      } else {
        this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code] = {};
        this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][parentIndex] = {
          editable: false,
          children: []
        }
      }
    } else {
      this.newInsertedFieldChildren[this.selectedPanel.code] = {};
      this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code] = {};
      this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][parentIndex] = {
        editable: false,
        children: []
      }
    }
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
      is_hidden: false,
      selected_value: {
          label: "Not Mapped",
          code: ""
      },
      value_options: [],
      children: []
    }
    this.selectedTab.mapping_options.push(field);
    this.goToField(field, this.selectedTab.mapping_options.length - 1)
    if (this.newInsertedFieldChildren[this.selectedPanel.code] && this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code] && this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][this.selectedTab.mapping_options.length - 1]) {
      this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][this.selectedTab.mapping_options.length - 1] = {
        editable: true,
        children: []
      }
    } else {
      this.setNewInsertedParent(this.selectedTab.mapping_options.length - 1);
      this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][this.selectedTab.mapping_options.length - 1] = {
        editable: true,
        children: []
      }
    }
    
    setTimeout(() => {
      document.getElementById(`parent_${this.selectedTab.mapping_options.length-1}`).focus();
    }, 0);
  }

  /**
   * 
   * @param parentIndex Getter for is field should be editable or not
   * @returns 
   */

  isParentEditable(parentIndex) {
    return this.newInsertedFieldChildren[this.selectedPanel.code] && this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code] && this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][parentIndex]?.editable;
  }

  /**
   * 
   * @param field Represents editing field
   */

  editParent(field) {
      field.code = '';
  }

  /**
   * 
   * @param parentIndex Id of deleting field
   */

  removeParent(parentIndex) {
    delete this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][parentIndex];
    this.selectedTab.mapping_options.splice(parentIndex, 1);
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
    if (this.newInsertedFieldChildren[this.selectedPanel.code] && this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code] && this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][this.selectedFieldParentIndex]) {
      this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][this.selectedFieldParentIndex].children.push(this.selectedField.children.length - 1);
    } else {
      this.setNewInsertedParent(this.selectedFieldParentIndex);
      this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][this.selectedFieldParentIndex] = {
        editable: false,
        children: [this.selectedField.children.length - 1]
      }
    }
    setTimeout(() => {
      document.getElementById(`child${this.selectedFieldParentIndex}_${this.selectedField.children.length - 1}`).focus();
    }, 0);
  }

  /**
   * 
   * @param field Editing child
   */

  editChild(field) {
      field.code = '';
  }

  /**
   * 
   * @param parentIndex Parent index of editing child
   * @param childIndex editing child index
   * @returns 
   */

  isChildEditable(parentIndex, childIndex) {
    return this.newInsertedFieldChildren[this.selectedPanel.code] && this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code] && this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][parentIndex] && this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][parentIndex].children.includes(childIndex);
  }

  /**
   * 
   * @param parentIndex Parent index of deleting child
   * @param childIndex Index of deleting child
   * @param field Deleting field reference
   */

  removeChild(parentIndex, childIndex, field) {
    const temp = this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][parentIndex].children;
    this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][parentIndex].children = [];
    temp.forEach((value, index) => {
      if (value > childIndex) {
        this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][parentIndex].children.push(value - 1);
      } else if (value < childIndex) {
        this.newInsertedFieldChildren[this.selectedPanel.code][this.selectedTab.code][parentIndex].children.push(value);
      }
    });
    field.children.splice(childIndex, 1);
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

  getApiSyncOptions() {
    return this.integrationInstance.integration.sync_options.map(option => {
      return {
        code: option.code,
        is_active: option.is_active !== undefined ? option.is_active : false,
        is_activated: option.is_activated !== undefined ? option.is_activated : false,
        sub_sync_options: option.sub_sync_options
      }  
    })
  }

  updateIntegration(){
    console.log("AddIntegration");
    this.updateMappedSyncOptions();
    delete this.mappedIntegration.connection;
    this._syncOptionService.createIntegration(this.mappedIntegration).pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(integration => {
      if(integration) {
        this._syncOptionService.mappedIntegration = {...integration};
      }
    });
  }
  saveIntegration(){
    console.log("Save Integration");
    this.updateMappedSyncOptions();
    delete this.mappedIntegration.connection;
    this._syncOptionService.updateInstalledIntegration(this.mappedIntegration).pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(integration => {
      if(integration) {
        this._syncOptionService.mappedIntegration = {...integration};
      }
    });
  }
}
