/*In-Built*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChartJSComponent } from '../../../controls/charts/chartjs/chartjs.component';

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';
import { ChartType } from '../../../enums/common.enums';

/*Model*/
import { DeviceModel } from '../../../models/deviceModel';
import { MachineDataModel } from '../../../models/machineDataModel';
import { ReportModel } from '../../../models/reportModel';

/*Services*/
import { AppContextService } from '../../../shared/appContext.service';
import { AppSettingsService } from '../../../shared/appSetting.service';
import { ChartService } from '../../../shared/chart.service';
import { ExcelService } from '../../../shared/excel.service';
import { ReportService } from '../../../shared/report.service';
import { CommonService } from '../../../shared/common.service';
import { DeviceService } from '../../../components/device/service/device.service';

@Component({
  selector: 'app-pyrometer',
  templateUrl: './pyrometer.component.html',
  styleUrls: ['./pyrometer.component.css']
})

export class PyrometerComponent implements OnInit {
  @ViewChild('chartLeftSide') childChartLeft: ChartJSComponent;
  @ViewChild('chartRightSide') childChartRight: ChartJSComponent;

  typeLeft: any = "";
  typeRight: any = "";

  labels: any = [];
  date: Date;
  dateSettings: any;
  datasetsLeft: any = [];
  datasetsMinLeft: any = [];
  datasetsMaxLeft: any = [];

  datasetsRight: any = [];
  datasetsMinRight: any = [];
  datasetsMaxRight: any = [];

  reportData: any = [];

  deviceInfo: DeviceModel;
  excelButttonText: string = "";
  Loading: boolean = false;
  report = new ReportModel();
  submitButtonText: string = "";
  spinnerClass: string = "";
  sParameterLeft: string = "";
  sParameterRight: string = "";

  form: FormGroup;

  constructor(    
    private _activatedRoute: ActivatedRoute,
    private _appSettingsService: AppSettingsService,
    private _context: AppContextService,
    private _commonService: CommonService,   
    private _chartService: ChartService,
    private _deviceService: DeviceService,
    private _excelService: ExcelService,
    private _formBuilder: FormBuilder,
    private _reportService: ReportService) {
    this.deviceInfo = new DeviceModel();
    this.excelButttonText = AppConstant.ExportToExcel;
    this.submitButtonText = AppConstant.Submit;
    this.spinnerClass = IconConstant.spinnerClass;
    this.typeLeft = ChartType.line;
    this.typeRight = ChartType.line;
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

  onSubmit() {
    this.report.StartDate = this._commonService.getDateInYYYY_MM_DD(this.date)
    this.fetchChartData();
  }

  fetchChartData() {
    this.Loading = true;
    this._reportService.getPyroMeterReport(this.report).subscribe((data: any) => {
      this.reportData = JSON.parse(data);
      this.updateChart();
    });
  }

  updateChart() {
    this.datasetsLeft = [];
    this.datasetsMinLeft = [];
    this.datasetsMaxLeft = [];
    this.datasetsRight = [];
    this.datasetsMinRight = [];
    this.datasetsMaxRight = [];

    this.labels = [];

    for (var iCount = 0; iCount < this.reportData.length; iCount++) {
      var left = this.report.ParameterModel.findIndex(x => x.Name == "LeftSideJobTemperature");
      var right = this.report.ParameterModel.findIndex(x => x.Name == "RightSideJobTemperature");

      if (left != -1) {
        this.datasetsLeft.push(this.reportData[iCount][this.report.ParameterModel[0].Name]);
        this.datasetsMinLeft.push(this.report.ParameterModel[left].MinThresHoldValue);
        this.datasetsMaxLeft.push(this.report.ParameterModel[left].MaxThresHoldValue);
      }
      if (right != -1) {
        this.datasetsRight.push(this.reportData[iCount][this.report.ParameterModel[right].Name]);
        this.datasetsMinRight.push(this.report.ParameterModel[right].MinThresHoldValue);
        this.datasetsMaxRight.push(this.report.ParameterModel[right].MaxThresHoldValue);
      }
      this.labels.push(this.reportData[iCount]["Time"]);
    }
    this.Loading = false;

    this.childChartLeft.updateChart(this.datasetsLeft, this.labels, this.datasetsMaxLeft, this.datasetsMinLeft);
    this.childChartRight.updateChart(this.datasetsRight, this.labels, this.datasetsMaxRight, this.datasetsMinRight);

  }

  getParameters() {
    this._reportService.getParameterByDeviceCode(this.report).subscribe((data: any) => {
      for (var i = 0; i < data.length; i++) {
        if (data[i]["DisplayOnSelection"] == true && data[i]["Name"] == "LeftSideJobTemperature") {
          this.report.ParameterModel.push(data[i]);
          this.sParameterLeft = data[i].DisplayName + " (℃)";
          this.fetchChartData();
        }
        if (data[i]["DisplayOnSelection"] == true && data[i]["Name"] == "RightSideJobTemperature") {
          this.report.StartHour = this._appSettingsService.getSliderDefaultValue();
          this.report.ParameterModel.push(data[i]);
          this.sParameterRight = data[i].DisplayName + " (℃)";
          this.fetchChartData();
        }
      }
    });
  }

  sliderChangeRight(object: any) {
    this.sliderEvent(object);
    this.childChartLeft.setSliderValue(object.Hour);
  }

  sliderChangeLeft(object: any) {
    this.sliderEvent(object);
    this.childChartRight.setSliderValue(object.Hour);
  }

  private sliderEvent(object: any) {
    this.report.StartHour = object.Hour;
    this.date = new Date(this._commonService.getDateInYYYY_MM_DD(this.date, object.addDay));
    this.report.StartDate = this._commonService.getDateInYYYY_MM_DD(this.date);
    this.fetchChartData();
  }

  getDeviceById(code: string) {
    this.deviceInfo = new DeviceModel();
    this._deviceService.getDeviceByCode(code).subscribe((data: DeviceModel) => {
      this.deviceInfo = data;      
    });
  }
}
