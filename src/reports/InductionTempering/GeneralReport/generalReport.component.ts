
/*In-Built*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';;
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

/*component*/
import { ChartJSComponent } from '../../../controls/charts/chartjs/chartjs.component';

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { ChartType, DirectionEnum } from '../../../enums/common.enums';
import { IconConstant } from '../../../constants/icon.constant';
/*Models*/
import { DeviceModel } from '../../../models/deviceModel';
import { MachineDataModel } from '../../../models/machineDataModel';
import { ParameterModel } from '../../../models/parameterModel';
import { ReportModel } from '../../../models/reportModel';

/*Services*/
import { AppContextService } from '../../../shared/appContext.service';
import { AppSettingsService } from '../../../shared/appSetting.service';
import { ChartService } from '../../../shared/chart.service';
import { ExcelService } from '../../../shared/excel.service';
import { ReportService } from '../../../shared/report.service';
import { ParameterComponent } from '../../../controls/parameter/parameter.component';
import { CommonService } from '../../../shared/common.service';
import { DeviceService } from '../../../components/device/service/device.service';


@Component({
  selector: 'app-report-general',
  templateUrl: './generalReport.component.html',
  styleUrls: ['./generalReport.component.css']
})

export class GeneralReportComponent implements OnInit {
  @ViewChild('excelData') tblExcel: ElementRef;
  @ViewChild("selectedDate") datepicker: ElementRef;
  @ViewChild("parameter") parameter: ElementRef;
  @ViewChild('chart') childChart: ChartJSComponent;

  //chart variable
  type: any = "";
  labels: any = [];
  datasets: any = [];
  reportData: any = [];

  deviceInfo: DeviceModel;
  dateSettings: any;
  date: Date;
  excelButttonText: string = "";
  Loading: boolean = false;
  parameterList: ParameterModel[] = [];
  report = new ReportModel();
  submitButtonText: string = "";
  spinnerClass: string = "";
  sliderDirection: string = DirectionEnum.Bottom;
  sParameter: string = "";

  form: FormGroup;

  constructor(
    private _context: AppContextService,
    private _appSettingsService: AppSettingsService,
    private _commonService: CommonService,
    private _activatedRoute: ActivatedRoute,
    private _deviceService:DeviceService,
    private _chartService: ChartService,
    private _excelService: ExcelService,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private _reportService: ReportService) {
    this.deviceInfo = new DeviceModel();
    this.excelButttonText = AppConstant.ExportToExcel;
    this.submitButtonText = AppConstant.Submit;
    this.spinnerClass = IconConstant.spinnerClass;
    this.type = ChartType.line;
  }

  ngOnInit() {
    this.IntializeForm();
  }

  IntializeForm() {
    let todayDate = new Date();
    this.date = todayDate;

    this.dateSettings = {
      bigBanner: false,
      timePicker: false,
      format: 'yyyy-MM-dd',
      defaultOpen: false
    }

    
    this.report.DeviceCode = this._activatedRoute.parent.snapshot.params["code"];
    this.report.DeviceCode = this.report.DeviceCode.toUpperCase();

    //this.report.DeviceCode = this._activatedRoute.snapshot.params["code"];

    //fetching value of current selected device from appcontext if available
    this.deviceInfo = this._context.getContextByKey(AppConstant.DeviceKey);
    if (!!!this.deviceInfo) {
      this.getDeviceById(this.report.DeviceCode);
    }

    // setting today date;    
    this.report.StartDate = this._commonService.getDateInYYYY_MM_DD(todayDate);
    this.form = this._formBuilder.group({
      sDate: [this.report.StartDate]
    })
    this.getParameters();
  }

  onParameterChange(indexvalue: number) {
    this.report.ParameterModel = [];
    this.report.ParameterModel.push(this.parameterList[indexvalue]);
    this.sParameter = this.report.ParameterModel[0].DisplayName;
    this.updateChart();
  }

  onSubmit() {        
    this.report.StartDate = this._commonService.getDateInYYYY_MM_DD(this.date);
    this.sParameter = this.report.ParameterModel[0].DisplayName;
    this.fetchChartData();
  }

  fetchChartData() {
    this.Loading = true;
    this._reportService.getGeneralReport(this.report).subscribe((data: any) => {
      this.reportData = JSON.parse(data);
      this.updateChart();
    });
  }

  updateChart() {
    this.datasets = [];
    this.labels = [];
    for (var iCount = 0; iCount < this.reportData.length; iCount++) {
      this.datasets.push(this.reportData[iCount][this.report.ParameterModel[0].Name]);
      this.labels.push(this.reportData[iCount]["Time"]);
    }

    this.Loading = false;
    this.childChart.updateChart(this.datasets, this.labels);

  }

  back() {
    this._location.back();
  }

  getParameters() {
    this.parameterList = [];
    this._reportService.getParameterByDeviceCode(this.report).subscribe((data: any) => {
      for (var i = 0; i < data.length; i++) {
        if (data[i]["DisplayOnSelection"] == true) {
          this.parameterList.push(data[i]);
        }
      }
      if (this.parameterList.length > 0) {
        this.report.StartHour = this._appSettingsService.getSliderDefaultValue();
        this.report.ParameterModel.push(this.parameterList[0]);
        this.sParameter = this.report.ParameterModel[0].DisplayName;
        this.fetchChartData();
      }
    });

  }

  sliderChange(object: any) {    
    this.report.StartHour = object.Hour;
    this.date = new Date(this._commonService.getDateInYYYY_MM_DD(this.date, object.addDay));
    this.report.StartDate = this._commonService.getDateInYYYY_MM_DD(this.date)
    this.fetchChartData();
  }

  getDeviceById(code: string) {
    this.deviceInfo = new DeviceModel();
    this._deviceService.getDeviceByCode(code).subscribe((data: DeviceModel) => {
      this.deviceInfo = data;
    });
  }
}
