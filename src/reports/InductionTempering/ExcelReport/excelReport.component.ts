
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
  selector: 'app-report-excel',
  templateUrl: './excelReport.component.html',
  styleUrls: ['./excelReport.component.css']
})

export class ExcelReportComponent implements OnInit {
  @ViewChild('excelData') tblExcel: ElementRef;

  deviceInfo: DeviceModel;
  dateSettings: any;
  excelButttonText: string = "";
  Loading: boolean = false;
  machineData: any = [];
  date: Date;
  parameterList: ParameterModel[] = [];
  report = new ReportModel();
  submitButtonText: string = "";
  spinnerClass: string = "";
  Total: any = [];

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

    this._reportService.getParameterByDeviceCode(this.report).subscribe(data => {
      this.parameterList = data;
    })
  }

  onSubmit() {
    this.machineData = [];
    this.Total = [];
    this.Loading = true;
    this.report.DeviceCode = this.report.DeviceCode.toUpperCase();
    this.report.StartDate = this._commonService.getDateInYYYY_MM_DD(this.date);
    this._reportService.getExcelReport(this.report).subscribe((data: any) => {
      debugger;
      for (var i = 0; i < data.length - 1; i++) {
        this.machineData.push(data[i]);
      }
      if (data.length > 0) {
        this.Total.push(data[data.length - 1]);
      }
      this.Loading = false;
    });
  }

  exportExcel() {
    let dateString = this.report.StartDate.replace(/[^a-zA-Z0-9]/g, '');
    this._excelService.ExportHtmlTableToExcel(this.machineData, "ExcelReport_" + dateString, "Excel Report", this.tblExcel.nativeElement);
  }

  back() {
    this._location.back();
  }

  getParameterStandardValue(name: string) {
    if (this.parameterList.length > 0) {
      let result = this.parameterList.find(x => x.Name.toLowerCase() == name);
      return !!result ? result.StandardValue : 'NA';
    }
    else {
      return '';
    }
  }

  getParameterMaxThreshold(name: string) {
    if (this.parameterList.length > 0) {
      let result = this.parameterList.find(x => x.Name.toLowerCase() == name);
      return !!result ? result.MaxThresHoldValue : 'NA';
    }
    else {
      return '';
    }
  }

  getParameterMinThreshold(name: string) {
    if (this.parameterList.length > 0) {
      let result = this.parameterList.find(x => x.Name.toLowerCase() == name);
      return !!result ? result.MinThresHoldValue : 'NA';
    }
    else {
      return '';
    }
  }

  checkIsValueBetweenMinAndMaxThreshold(name: string, value: any) {
    if (this.parameterList.length > 0) {
      let result = this.parameterList.find(x => x.Name.toLowerCase() == name);
      return !!result &&
        (!!result.MinThresHoldValue || result.MinThresHoldValue > value) ||
        (!!result.MaxThresHoldValue || result.MaxThresHoldValue < value) ? true : false;
    }
    else {
      return false;
    }
  }

  checkValueIsStandard(name: string, value: any) {
    if (this.parameterList.length > 0) {
      let result = this.parameterList.find(x => x.Name.toLowerCase() == name);
      if (!!!result) {
        return false;
      }
      else {
        return result.StandardValue != value ? true : false;
      }
    }
    else {
      return false;
    }
  }

  getDeviceById(code: string) {
    this.deviceInfo = new DeviceModel();
    this._deviceService.getDeviceByCode(code).subscribe((data: DeviceModel) => {
      this.deviceInfo = data;
    });
  }
}
