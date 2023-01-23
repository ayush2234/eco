import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { Integration, MAPPING_OPTIONS_TYPE, SyncOption, ValuesList, ValuesListOptions, VALUE_OPTION_TYPE } from '../../add-integration.types';
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
  @Input() integration: Integration;
  @Input() syncOption: SyncOption;
  @Input() valuesList: ValuesList[];

  syncOptions: SyncOption[];
  selectedPanel: SyncOption;
  selectedGroup: SyncOption;
  selectedField: SyncOption;
  availableOptions: ValuesList[];
  inputOptions: InputOption = {
    option: undefined,
    isActive: false,
    title: null,
    label: null,
    value: ''
  }
  validate = false;

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

  /**
   * Activate panel
   */
  activatePanel(): void {
    // const activatedSyncOption = { ...this.syncOption, isActive: true };
    // this._syncOptionService.wipIntegration = {
    //   ...this.integration,
    //   syncOptions: this.integration?.syncOptions?.map(syncOption =>
    //     syncOption.key === this.syncOption.key
    //       ? activatedSyncOption
    //       : syncOption
    //   ),
    // };
  }

  /**
   * Set the active option group.
   *
   * @param group Represents the group to be activated.
   */
  goToGroup(group: SyncOption): void {
    this.selectedGroup = group;
    this.resetFieldSelection();
  }

  /**
   * Set the active field.
   *
   * @param field Represents the field to be activated.
   */
  goToField(field: SyncOption): void {
    this.selectedField = field;
    console.log(this.selectedField)
    this.loadSelectOptions();
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
  isConditionSatisfied(option: SyncOption): boolean {
    if(option.display_conditions) {
      const splitedCondition = option.display_conditions.split('==').map(x => x.trim());
      if(splitedCondition.length === 2) {
        const code = splitedCondition[0];
        const value = splitedCondition[1];
        const dependencyField = this.checkConditionRecursively(this.selectedPanel, code);
        if(dependencyField !== null) {
          return dependencyField.selected_value.code === value;
        }
      }

      return false;
    } else {
      return true;
    }
  }

  /**
   * Returns the dependecy field.
   * 
   * @param syncOption Represents the dependent field.
   * @param code Represents the code of dependency field.
   * @returns The dependecy field
   */
  checkConditionRecursively(syncOption: SyncOption, code: string): SyncOption | null {
    if(syncOption.code === code) {
      return syncOption;
    }
    if(syncOption.mapping_options && syncOption.mapping_options.length) {
      let option: SyncOption | null = null;
      syncOption.mapping_options.forEach(mapping => {
        if(option === null) {
          option = this.checkConditionRecursively(mapping, code);
        }
      })
      return option;
    }
    return null;
  }

  /**
   * Set default tab/group.
   */
  setDefaultGroup(): void {
    const group = 
      !this.selectedPanel.mapping_options.length ? undefined :
      (this.isGrouped(this.selectedPanel.mapping_options[0]) ? this.selectedPanel.mapping_options[0] : this.selectedPanel);
    this.goToGroup(group);
  }

  /**
   * Returns true if it is a tab/group and false otherwise.
   * 
   * @param option Represents the sync option.
   * @returns True if it is a tab/group and false otherwise.
   */
  isGrouped(option: SyncOption): boolean {
    return option?.type === MAPPING_OPTIONS_TYPE.group;
  }

  /**
   * Load select options
   */
  loadSelectOptions(): void {
    // Handling values_list option only at the moment.
    let loadOptionObservables: Observable<ValuesList>[] = [];
    this.selectedField.value_options.forEach((option) => {
      switch(option.value_option_type) {
        case VALUE_OPTION_TYPE.values_list:
          loadOptionObservables.push(
            this._syncOptionService.getValueListOptions(option)
          )
          break;
        default:
          break;
      }
    });

    combineLatest(loadOptionObservables).pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(res => {
      this.availableOptions = [...res.filter(result => result !== undefined)];
      console.log(this.availableOptions);
    })
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

    if(this.selectedField.code === this.selectedGroup.code) {
      this.selectedGroup = {...this.selectedField}
    } else {
      const index = this.selectedGroup.mapping_options.findIndex(x => x.code === this.selectedField.code);
      if(index !== -1) {
        this.selectedGroup.mapping_options[index] = {...this.selectedField};
      }
    }

    const groupIndex = this.selectedPanel.mapping_options.findIndex(x => x.code === this.selectedGroup.code);
    if(groupIndex !== -1) {
      this.selectedPanel.mapping_options[groupIndex] = {...this.selectedGroup};
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
}
