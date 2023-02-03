import { moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { PortalBridgeService } from 'app/layout/common/eco-drawer/portal-bridge.service';
import { Subject, takeUntil } from 'rxjs';

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
  drawerOpened: boolean = true;
  fuseDrawerOpened: boolean = true;
  formObjectStringified!: string;
  
  @Input() isOpen = true;
  @ViewChildren('mappingOptionItem') mappingOptionItems: QueryList<any>;
  formObj = {
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
  selectedPanel: any;
  selectedPanelIndex: number = 0;
  selectedTab;
  selectedSyncOptionTab: number = -1;
  currentDraggingMappingOptionIndex: any = null;
  protected _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _portalBridge: PortalBridgeService,
    private _changeDetector: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService
  ) { }

  ngOnInit(): void {
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
      if(element.nativeElement.contains(target)) {
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
        if (this.formObj[this.selectedTab].length > (index - 1)) {
          this.selectedPanelIndex = index;
        } else if(this.formObj[this.selectedTab].length) {
          this.selectedPanelIndex = 0;
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
      value_options: []
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
  
  onCancel(): any {
    this.fuseDrawerOpened = false;
  }


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
  mappingOptionDragStart(mappingOptionIndex) {   
    this.currentDraggingMappingOptionIndex = mappingOptionIndex;
  }

  onViewJSON() {
    this.formObjectStringified = JSON.stringify(this.formObj);
    this._changeDetector.detectChanges();
    setTimeout(() => {
      document.getElementById('formJSON')?.click();
    }, 100);
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
