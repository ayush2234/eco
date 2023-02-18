import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {} from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SyncLogsService } from '../../../user/sync-logs/sync-logs.service';
import { SyncLog } from '../../../user/sync-logs/sync-logs.types';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'eco-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class SyncLogsProductComponent implements OnInit, AfterViewInit {
  dataSource;
  displayedColumns = [];
  tableArr: any;
  syncLogs$;
  productData;
  filterValue;
  isLoading: boolean = false;
  toppings = new FormControl('');
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Constructor
   */
  constructor(
    private _syncLogService: SyncLogsService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  getStatus(status) {
    switch (status) {
      case 'Ok':
        return '#22bfb7';
      case 'Warning':
        return '#e0af0b';
      case 'Error':
        return '#c92d0e';
    }
  }

  columnNames = [
    {
      id: 'date_created',
    },
    {
      id: 'integration',
    },
    {
      id: 'syncStatus',
    },
    {
      id: 'syncLifecycle',
    },
    {
      id: 'sourceOrderID',
    },
    {
      id: 'channelOrderID',
    },
    {
      id: 'items',
    },
    {
      id: 'shipment',
    },
    {
      id: 'shipmentStatus',
    },
    {
      id: 'actionRequired',
    },
    {
      id: 'details',
    },
  ];

  ngOnInit() {
    // Get the syncLogs
    this.syncLogs$ = this._syncLogService.syncLogProducts$;
    this.syncLogs$.subscribe(res => {
      this.tableArr = res.map(data => ({
        date_created: data.date_created,
        integration: data,
        syncStatus: data.log.status,
        syncLifecycle: data.log.lifecycle,
        sourceOrderID: data.source,
        channelOrderID: data.channel,
        items: data.orderlines,
        shipment: data.orderlines,
        shipmentStatus: data.orderlines,
        actionRequired: data.log,
        details: data.log,
      }));
      console.log('res', res);
      console.log(this.tableArr);
      this.dataSource = new MatTableDataSource(this.tableArr);
    });

    this.dataSource.sort = this.sort;
    this.displayedColumns = this.columnNames.map(x => x.id);

    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return (
        data.date_created.toLowerCase().includes(filter) ||
        data.integration.integration.name.toLowerCase().includes(filter) ||
        data.integration.integration_instance.name
          .toLowerCase()
          .includes(filter) ||
        data.syncStatus.toLowerCase().includes(filter) ||
        data.syncLifecycle.toLowerCase().includes(filter) ||
        data.sourceOrderID.order_id.toLowerCase().includes(filter) ||
        data.sourceOrderID.status.toLowerCase().includes(filter) ||
        data.channelOrderID.order_id.toLowerCase().includes(filter) ||
        data.channelOrderID.status.toLowerCase().includes(filter) ||
        data.items.some(
          itemData =>
            itemData.sku.toLowerCase().includes(filter) ||
            itemData.qty.toLowerCase().includes(filter) ||
            itemData.name.toLowerCase().includes(filter)
        ) ||
        data.shipment.some(
          shipmentData =>
            shipmentData.carrier.toLowerCase().includes(filter) ||
            shipmentData.carrier_tracking.toLowerCase().includes(filter)
        ) ||
        data.shipmentStatus.some(shipmentStatusData =>
          shipmentStatusData.carrier_tracking_status
            .toLowerCase()
            .includes(filter)
        )
      );
    };
  }

  // openDialog(): void {
  //   let dialogRef = this.dialog.open(ProductDialogComponent, {
  //     width: '350px',
  //     data: { name: this.filterValue, filter: this.filterValue },
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('result', result);

  //     this.filterValue = result;
  //     //this.filterValue.trim(); // Remove whitespace
  //     //this.filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  //     this.dataSource.filter = this.filterValue;
  //   });
  // }

  applyFilter(filterValue: any) {
    this.isLoading = true;
    console.log(filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (filterValue === '') {
      this.isLoading = false;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onView() {
    //this.router.navigate['/product/productDetails'];
  }
}
