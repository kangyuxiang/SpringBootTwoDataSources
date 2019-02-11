import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';

import { merge, Observable, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { DatatableRequest } from '@models/datatable-request';
import { BaseEntity } from '@models/base-entity';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatatableComponent implements OnInit, AfterViewInit {

  @Input()
  data$: Observable<BaseEntity[]>;

  @Input()
  isLoadingResults = false;

  @Input()
  resultsLength = 0;

  displayedColumns = [ 'name' ];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  @Output()
  getDataEvent = new EventEmitter<DatatableRequest>(true); // must be true or else ExpressionChangedAfterItHasBeenCheckedError

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          const datatableRequest: DatatableRequest = {
            page: this.paginator.pageIndex,
            size: this.paginator.pageSize,
            sorts: [`${this.sort.active},${this.sort.direction || this.sort.active}`]
          };
          return of(datatableRequest);
        })
      )
      .subscribe(datatableRequest => this.getDataEvent.emit(datatableRequest));
  }

}