
import { Component, Input, Output, SimpleChanges, EventEmitter, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';

import { AppConstant } from '../../constants/app.constants';
import { IconConstant } from '../../constants/icon.constant';
import { PagingAction } from '../../enums/common.enums';


import { DynamicObject } from '../../interface/dynamicObject';
import { PagingModel } from '../../models/PagingModel';


import { AppSettingsService } from '../../shared/appSetting.service';
import { UserInfoService } from '../../shared/userInfo.service';



@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html'
})

export class GridComponent implements OnInit, OnChanges, DynamicObject {
  @ViewChild('search') search: ElementRef;

  /*Input & Output property*/
  @Input() CloneAccess: boolean = false;
  @Input() DisplayColumns: string[];
  @Input() HyperLinkColumn: string = '';
  @Input() GridData: any;
  @Input() Loading: boolean;
  @Input() SearchVisible: boolean = false;
  @Input() PagingModel = new PagingModel();
  @Input() ReadAccess: boolean = false;
  @Input() ValueColumns: string[];
  @Input() UpdateAccess: boolean = false;

  @Output() notifyAdd = new EventEmitter<any>();
  @Output() notifyUpdate = new EventEmitter<any>();
  @Output() notifyPaging = new EventEmitter<any>();
  @Output() notifyClone = new EventEmitter<any>();
  @Output() notifyView = new EventEmitter<any>();


  /*Local Property*/
  public currentPagingAction: PagingAction;
  public colspan: number = 0;
  public cloneButtonText: string;
  public cloneIcon: string;
  public disableIcon: string;
  public editButtonText: string;
  public editIcon: string;
  public enableIcon: string;
  public GridArray: any = [];
  public noRecordFound: boolean = false;
  public noRecordFoundText: string = '';
  public nonPageIndexColSpan: number = 0;
  public pageIndexColSpan: number = 0;
  public pagingModel: PagingModel;
  public spinnerClass: string;
  public searchButtonText: string;
  public searchIcon: string;
  public startingIndexOfCurrentPage: number = 1;


  constructor(
    private _userInfoService: UserInfoService,
    private _appSettingsService: AppSettingsService) {
    this.spinnerClass = IconConstant.spinnerClass;
    this.noRecordFoundText = AppConstant.NoRecordFound;
    this.pagingModel = new PagingModel();

    this.cloneButtonText = AppConstant.Clone;
    this.editButtonText = AppConstant.Edit;
    this.searchButtonText = AppConstant.Search;

    this.cloneIcon = IconConstant.Clone;    
    this.disableIcon = IconConstant.Disable;
    this.editIcon = IconConstant.Edit;
    this.enableIcon = IconConstant.Enable;
    this.searchIcon = IconConstant.Search;

  }

  ngOnInit() {
    this.ValueColumns.push('object');
    this.intializeGrid('');
    this.colspan = this.DisplayColumns.length + 1 + (this.UpdateAccess ? 1 : 0);
    this.pageIndexColSpan = this.colspan % 2 == 0 ? 2 : 3;
    this.nonPageIndexColSpan = (this.colspan - this.pageIndexColSpan) / 2;
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      this.intializeGrid(propName);
    }
  }


  intializeGrid(changeProperty: string) {
    this.GridArray = [];
    if (!!this.GridData && this.GridData.length > 0) {
      this.noRecordFound = false;
      for (let iRow = 0; iRow < this.GridData.length; iRow++) {
        let GridObject: DynamicObject = {};
        for (let iCol = 0; iCol < this.ValueColumns.length; iCol++) {
          let columnData = '';
          let gridRowObject = this.GridData[iRow];
          if (this.ValueColumns[iCol].toLowerCase() == "object") {
            GridObject[this.ValueColumns[iCol].replace('.', '').toLowerCase()] = gridRowObject;
          }
          else if (this.ValueColumns[iCol].toLowerCase() == "datecreated" || this.ValueColumns[iCol].toLowerCase() == "createddatetime") {
            GridObject[this.ValueColumns[iCol].replace('.', '')] = this.ConvertDateToSpecificFormat(gridRowObject[this.ValueColumns[iCol]]);
          }
          else {
            let noOfColumn = this.ValueColumns[iCol].split('~').length;
            let currentcolumn = 0;
            this.ValueColumns[iCol].split('~').map(function (col) {
              let rowValue = gridRowObject;
              col.split('.').map(function (obj) {
                rowValue = !!rowValue[obj] || !rowValue[obj] ? rowValue[obj] : '';
              });
              if (noOfColumn > 1 && currentcolumn < noOfColumn - 1) {
                columnData += rowValue + ': ';
              } else {
                columnData += rowValue;
              }
              currentcolumn++;
            });
            GridObject[this.ValueColumns[iCol].replace('.', '')] = columnData;
          }
        }
        this.GridArray.push(GridObject);
      }
      this.pagingModel = this.PagingModel;
      if (changeProperty == 'GridData') {
        this.calculateStartingIndex(this.GridData.length, this.currentPagingAction);
      }
    }
    else {
      this.noRecordFound = true;
    }
  }


  filteredColumnName(obj: any): string[] {
    let gridColumns: string[] = [];
    let keys = Object.keys(obj)
    for (let iCol = 0; iCol < keys.length; iCol++) {
      if (keys[iCol].toLowerCase() != 'object') {
        gridColumns.push(keys[iCol]);
      }
    }
    return gridColumns;
  }

  /****************Grid Event Start*****************/
  add(model: any) {
    this.notifyAdd.emit(model);
  }
  edit(model: any) {
    this.notifyUpdate.emit(model);
  }
  clone(model: any) {
    this.notifyClone.emit(model);
  }
  view(model: any) {
    this.notifyView.emit(model);
  }
  /****************Grid Event Start*****************/


  /****************Paging Event Start*****************/
  pagingNext() {
    this.currentPagingAction = PagingAction.Next;
    
    this.notifyPaging.emit({ pageIndex: this.pagingModel.PageIndex, action: this.currentPagingAction.toString(), text: !!!this.search ? '' : this.search.nativeElement.value });
  }
  pagingPrev() {
    this.currentPagingAction = PagingAction.Prev;
    this.notifyPaging.emit({ pageIndex: this.pagingModel.PageIndex, action: this.currentPagingAction.toString(), text: !!!this.search ? '' : this.search.nativeElement.value });
  }
  /****************Paging Event End*****************/


  /* Private Method */
  private calculateStartingIndex(recordCount: number, action: string) {
    if (!!action && PagingAction.First != action) {
      if (PagingAction.Next == action) {
        if (this._appSettingsService.getPageSize() != recordCount) { this.startingIndexOfCurrentPage += this._appSettingsService.getPageSize() - recordCount; }
        this.startingIndexOfCurrentPage += recordCount;
      }
      else {
        this.startingIndexOfCurrentPage -= recordCount;
      }
    }
  }
  private ConvertDateToSpecificFormat(value: string): string {
    let cDate = new Date(value + 'Z');

    let dateTimeFormat = this._appSettingsService.setting.DateFormat.split(' ');

    let configDateFormat = dateTimeFormat[0].toLowerCase();
    let configTimeFormat = dateTimeFormat.length > 1 ? dateTimeFormat[1].toLowerCase() : "";


    configDateFormat = configDateFormat.replace('dd', (cDate.getDate() > 9 ? '' : '0') + cDate.getDate().toString());
    configDateFormat = configDateFormat.replace('mm', (cDate.getMonth() > 8 ? '' : '0') + (cDate.getMonth() + 1).toString());
    configDateFormat = configDateFormat.replace('yyyy', (cDate.getFullYear()).toString());

    configTimeFormat = configTimeFormat.replace('hh', (cDate.getHours() > 9 ? '' : '0') + cDate.getHours().toString());
    configTimeFormat = configTimeFormat.replace('mm', (cDate.getMinutes() > 9 ? '' : '0') + cDate.getMinutes().toString());
    configTimeFormat = configTimeFormat.replace('ss', (cDate.getSeconds() > 9 ? '' : '0') + cDate.getSeconds().toString());

    return configDateFormat + ' ' + configTimeFormat;
  }
  /* Private Method */

  /*Search on Device*/
  searchData() {
    
    var searchText = this.search.nativeElement.value;
    this.currentPagingAction = PagingAction.First;
    this.pagingModel.PageIndex = 0;
    this.startingIndexOfCurrentPage = 1;
    this.notifyPaging.emit({ pageIndex: this.pagingModel.PageIndex, action: this.currentPagingAction.toString(), text: !!!this.search ? '' : searchText.toLowerCase() });
  }
}
