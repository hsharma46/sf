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
  selector: 'app-pitchTime',
  templateUrl: './pitchTime.component.html',
  styleUrls: ['./pitchTime.component.css']
})

export class PitchTimeComponent implements OnInit {
  @ViewChild('chart') childChart: ChartJSComponent;

  //chart variable
  type: any = "";
  labels: any = [];
  datasets: any = [];
  reportData: any = [];

  date: Date;
  dateSettings: any;
  deviceInfo: DeviceModel;
  excelButttonText: string = "";
  Loading: boolean = false;
  report = new ReportModel();
  submitButtonText: string = "";
  spinnerClass: string = "";
  sParameter: string = "";

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

  onSubmit() {
    this.report.StartDate = this._commonService.getDateInYYYY_MM_DD(this.date)
    this.fetchChartData();
  }

  fetchChartData() {
    this.Loading = true;
    this._reportService.getPitchTimeReport(this.report).subscribe((data: any) => {
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

  getParameters() {
    this._reportService.getParameterByDeviceCode(this.report).subscribe((data: any) => {
      for (var i = 0; i < data.length; i++) {
        if (data[i]["DisplayOnSelection"] == true && data[i]["Name"] == "CycleTime") {
          this.report.StartHour = this._appSettingsService.getSliderDefaultValue();
          this.report.ParameterModel.push(data[i]);
          this.sParameter = data[i].DisplayName + "(In Seconds)";
          this.fetchChartData();
        }
      }
    });
  }

  sliderChange(object: any) {
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
