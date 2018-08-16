/*In-Builts*/
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';

/*Constants & Enums*/
import { AppConstant } from '../../constants/app.constants';
import { IconConstant } from '../../constants/icon.constant';
import { ExcelService } from '../../shared/excel.service';



@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @ViewChild('excelData') tblExcel: ElementRef;

  /* Property Creation */
  public isModalVisible: boolean;
  public noRecordFound: boolean = false;
  public noRecordFoundText: string = '';
  public excelButttonText: string = ''
  public excelIcon: string = '';

  /*Input Property*/
  @Input() Data: any = [];
  @Input() Title: string;
  @Input() DeviceCode: string;
  @Input() StartDate: string;
  @Input() EndDate: string;

  constructor(
    private _excelService: ExcelService
  ) {
    this.excelIcon = IconConstant.excel;
    this.excelButttonText = AppConstant.ExportToExcel;
    this.noRecordFoundText = AppConstant.NoRecordFound;
  }


  exportExcel() {    
    var startDateString = this.StartDate.replace(/[^a-zA-Z0-9]/g, '');
    var endDateString = this.EndDate.replace(/[^a-zA-Z0-9]/g, '');
    this._excelService.ExportHtmlTableToExcel(this.Data, "DailyProductionReportHourl_" + startDateString + "_" + endDateString, "ExcelReport", this.tblExcel.nativeElement);
  }


  openModal(data: any) {
    this.noRecordFound = false;
    this.isModalVisible = true;
    this.Data = !!!data ? [] : data;
    if (!!!data || data.length == 0) {
      this.noRecordFound = true;
    }
  }

  public closeModal() {
    this.isModalVisible = false;
  }
}
