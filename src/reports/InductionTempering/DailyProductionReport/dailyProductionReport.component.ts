
/*In-Built*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';;
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

/*Constants & Enums*/
import { ChartType } from '../../../enums/common.enums';
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';

/*Models*/
import { DeviceModel } from '../../../models/deviceModel';
import { ParameterModel } from '../../../models/parameterModel';
import { ReportModel } from '../../../models/reportModel';

/*Services*/
import { AppContextService } from '../../../shared/appContext.service';
import { ChartJSComponent } from '../../../controls/charts/chartjs/chartjs.component';
import { CommonService } from '../../../shared/common.service';
import { ReportService } from '../../../shared/report.service';
import { ModalComponent } from '../../../controls/modal_popup/modal.component';
import { DeviceService } from '../../../components/device/service/device.service';




@Component({
  selector: 'app-report-dailyProduction',
  templateUrl: './dailyProductionReport.component.html',
  styleUrls: ['./dailyProductionReport.component.css']
})

export class DailyProductionReportComponent implements OnInit {
  //@ViewChild("selectedStartDate") sDatepicker: ElementRef;
  //@ViewChild("selectedEndDate") eDatepicker: ElementRef;
  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('partCountChart') partCountChart: ChartJSComponent;
  @ViewChild('availabilityChart') availabilityChart: ChartJSComponent;
  @ViewChild('goodbadJobChart') goodbadJobChart: ChartJSComponent;
  @ViewChild('programChart') programChart: ChartJSComponent;

  deviceInfo: DeviceModel;

  type: any = "";
  dsPartCount: any = [];
  dsBadJob: any = [];
  dsGoodJob: any = [];
  dsAvailable: any = [];
  dsProgram: any = [];

  excelButttonText: string = "";
  endDate: any;
  Loading: boolean = false;
  LoadingViewData: boolean = false;
  labels: any = [];
  modalTitle: string = '';
  ModalData: any = [];
  machineData: any = [];
  parameterList: ParameterModel[] = [];
  report = new ReportModel();
  submitButtonText: string = "";
  spinnerClass: string = "";
  startDate: any;
  dateSettings: any;
  todayDate: Date=new Date();
  todayDate1: Date = new Date;

  form: FormGroup;

  constructor(
    private _context: AppContextService,
    private _commonService: CommonService,
    private _activatedRoute: ActivatedRoute,
    private _deviceService: DeviceService,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private _reportService: ReportService) {
    this.deviceInfo = new DeviceModel();
    this.submitButtonText = AppConstant.Submit;
    this.spinnerClass = IconConstant.spinnerClass;
    this.type = ChartType.line;
    this.modalTitle = "View Data";

    this.todayDate.setHours(8, 0, 0);
    this.todayDate.setDate(this.todayDate.getDate() - 1);
    this.todayDate1.setHours(8, 0, 0);
  }

  ngOnInit() {
    this.IntializeForm();
  }

  IntializeForm() {
    
    this.dateSettings = {
      bigBanner: true,
      timePicker: true,
      format: 'yyyy-MM-dd hh:mm a',
      defaultOpen: false
    }
    
    this.report.DeviceCode = this._activatedRoute.parent.snapshot.params["code"];
    this.report.DeviceCode = this.report.DeviceCode.toUpperCase();
    // this.report.DeviceCode = this._activatedRoute.snapshot.params["code"];

    //fetching value of Device From context if available
    this.deviceInfo = this._context.getContextByKey(AppConstant.DeviceKey);
    if (!!!this.deviceInfo) {
      this.getDeviceById(this.report.DeviceCode);
    }       

    
    this.startDate = this.todayDate;
    this.endDate = this.todayDate1;

    // setting today date;
    this.report.StartDate = this._commonService.getDateInYYYY_MM_DD_HH_MM_SS(this.startDate)
    this.report.EndDate = this._commonService.getDateInYYYY_MM_DD_HH_MM_SS(this.endDate)
    this.form = this._formBuilder.group({
      sDate: [this.report.StartDate],
      eDate: [this.report.EndDate]
    })

    this._reportService.getParameterByDeviceCode(this.report).subscribe(data => {
      this.parameterList = data;
    })
  }

  onSubmit() {
    this.machineData = [];
    this.report.StartDate = this._commonService.getDateInYYYY_MM_DD_HH_MM_SS(this.startDate);
    this.report.EndDate = this._commonService.getDateInYYYY_MM_DD_HH_MM_SS(this.endDate);
    this.fetchChartData();
  }

  fetchChartData() {
    this.Loading = true;
    this._reportService.getDailyProductionReportChart(this.report).subscribe((data: any) => {
      this.machineData = JSON.parse(data);
      this.Loading = false;
      this.updateChart();
    });
  }

  updateChart() {
    this.dsPartCount = [];
    this.dsBadJob = [];
    this.dsGoodJob = [];
    this.dsAvailable = [];
    this.dsProgram = [];

    this.labels = [];

    for (var iCount = 0; iCount < this.machineData.length; iCount++) {
      this.dsPartCount.push(this.machineData[iCount].part_count);
      this.dsGoodJob.push(this.machineData[iCount].GoodJob);
      this.dsBadJob.push(this.machineData[iCount].BadJob);
      this.dsProgram.push(this.machineData[iCount].program);
      this.dsAvailable.push(this.machineData[iCount].avail);
      this.labels.push(this.machineData[iCount]["Time"]);
    }
    this.Loading = false;

    this.partCountChart.updateChart(this.dsPartCount, this.labels, "", "", AppConstant.blueColor);
    this.availabilityChart.updateChart(this.dsAvailable, this.labels, "", "", AppConstant.blueColor);
    this.goodbadJobChart.updateChart(this.dsGoodJob, this.labels, this.dsBadJob, "", AppConstant.greenColor);
    this.programChart.updateChart(this.dsProgram, this.labels, "", "", AppConstant.blueColor);
  }

  viewData() {
    this.ModalData = [];
    this.LoadingViewData = true;
    this.report.StartDate = this._commonService.getDateInYYYY_MM_DD_HH_MM_SS(this.startDate);
    this.report.EndDate = this._commonService.getDateInYYYY_MM_DD_HH_MM_SS(this.endDate);
    this._reportService.getDailyProductionReport(this.report).subscribe((data: any) => {
      for (var i = 0; i < data.length - 1; i++) {
        this.ModalData.push(data[i]);
      }
      this.modal.openModal(this.ModalData);
      this.LoadingViewData = false;
    });
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
