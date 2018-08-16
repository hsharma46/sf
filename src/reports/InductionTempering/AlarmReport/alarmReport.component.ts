
/*In-Built*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';;
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';

/*Models*/
import { DeviceModel } from '../../../models/deviceModel';
import { ParameterModel } from '../../../models/parameterModel';
import { ReportModel } from '../../../models/reportModel';

/*Services*/
import { AppContextService } from '../../../shared/appContext.service';
import { CommonService } from '../../../shared/common.service';
import { ExcelService } from '../../../shared/excel.service';
import { ReportService } from '../../../shared/report.service';
import { DeviceService } from '../../../components/device/service/device.service';



@Component({
  selector: 'app-report-alarm',
  templateUrl: './alarmReport.component.html',
  styleUrls: ['./alarmReport.component.css']
})

export class AlarmReportComponent implements OnInit {
  @ViewChild('excelData') tblExcel: ElementRef;

  deviceInfo: DeviceModel;
  dateSettings: any;
  excelButttonText: string = "";
  Loading: boolean = false;
  machineCompleteData: any = [];
  machineData: any = [];
  date: Date;
  report = new ReportModel();
  submitButtonText: string = "";
  spinnerClass: string = "";

  form: FormGroup;

  constructor(
    private _context: AppContextService,
    private _commonService: CommonService,
    private _deviceService: DeviceService,
    private _activatedRoute: ActivatedRoute,
    private _excelService: ExcelService,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private _reportService: ReportService) {
    this.deviceInfo = new DeviceModel();
    this.excelButttonText = AppConstant.ExportToExcel;
    this.submitButtonText = AppConstant.Submit;
    this.spinnerClass = IconConstant.spinnerClass;
  }

  ngOnInit() {
    this.IntializeForm();
  }

  IntializeForm() {
    this.dateSettings = {
      bigBanner: false,
      timePicker: false,
      format: 'yyyy-MM-dd',
      defaultOpen: false
    }

    let todayDate = new Date();
    this.date = todayDate;

    this.report.DeviceCode = this._activatedRoute.parent.snapshot.params["code"];
    this.report.DeviceCode = this.report.DeviceCode.toUpperCase();


    //fetching value of current selected device from appcontext if available
    this.deviceInfo = this._context.getContextByKey(AppConstant.DeviceKey);
    if (!!!this.deviceInfo) {
      this.getDeviceById(this.report.DeviceCode);
    }

    // setting today date;
    this.report.StartDate = this._commonService.getDateInYYYY_MM_DD(this.date);
    this.form = this._formBuilder.group({
      sDate: [this.report.StartDate]
    })
  }

  onSubmit() {
    this.machineData = [];
    this.machineCompleteData = [];
    this.Loading = true;
    this.report.DeviceCode = this.report.DeviceCode.toUpperCase();
    this.report.StartDate = this._commonService.getDateInYYYY_MM_DD(this.date);
    this._reportService.getAlarmReport(this.report).subscribe((data: any) => {
      data = JSON.parse(data);
      this.machineCompleteData = data;
      this.machineData = data;
      this.Loading = false;
    });
  }

  exportExcel() {    
    this.machineData = [];
    this.machineCompleteData = [];
    this.Loading = true;
    this.report.DeviceCode = this.report.DeviceCode.toUpperCase();
    this.report.StartDate = this._commonService.getDateInYYYY_MM_DD(this.date);
    this._reportService.getAlarmReport(this.report).subscribe((data: any) => {
      data = JSON.parse(data);
      if (data.length > 0) {
        let dateString = this.report.StartDate.replace(/[^a-zA-Z0-9]/g, '');
        this._excelService.ExportJsonToExcel(data, "AlarmReport_" + dateString, "Alarm Report");
      }
      else {
        alert('No Alarm Data for the specific Date !');
      }
      this.Loading = false;
    });
    //this._excelService.ExportHtmlTableToExcel(this.machineCompleteData, "AlarmReport_" + dateString, "Alarm Report" this.tblExcel.nativeElement);
  }

  back() {
    this._location.back();
  }

  getDeviceById(code: string) {
    this.deviceInfo = new DeviceModel();
    this._deviceService.getDeviceByCode(code).subscribe((data: DeviceModel) => {
      this.deviceInfo = data;
    });
  }
}
