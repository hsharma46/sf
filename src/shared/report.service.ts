/*In-Builts*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';;

/*Constants*/
import { AppConstant } from '../constants/app.constants';

/*Models*/
import { DropDownModel } from '../models/dropDownModel';
import { MachineDataModel } from '../models/machineDataModel';
import { ParameterModel } from '../models/parameterModel';
import { ReportModel } from '../models/reportModel';

/*Service*/
import { AppSettingsService } from '../shared/appSetting.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'version': '1' })
};

@Injectable()
export class ReportService {
  dataList: any = [];

  constructor(
    private _http: HttpClient,
    private _appSettingsService: AppSettingsService) { }

  /* Observable method */
  public getParameterByDeviceCode(reportModel: ReportModel): Observable<ParameterModel[]> {
    const url = `${this._appSettingsService.getURL(AppConstant.ReportURL)}/getParameterbydevicecode?deviceCode=${reportModel.DeviceCode}`;
    return this._http.get<ParameterModel[]>(url, httpOptions);
  }


  public getExcelReport(reportModel: ReportModel): Observable<DropDownModel[]> {
    const url = `${this._appSettingsService.getURL(AppConstant.ReportURL)}/get-machine-data-daily-production-excel-report-hourly`;
    return this._http.post<DropDownModel[]>(url, reportModel, httpOptions);
  }

  public getGeneralReport(reportModel: ReportModel): Observable<any> {
    const url = `${this._appSettingsService.getURL(AppConstant.ReportURL)}/get-machine-data-general-report`;
    return this._http.post<any>(url, reportModel, httpOptions);
  }

  public getPitchTimeReport(reportModel: ReportModel): Observable<any> {
    const url = `${this._appSettingsService.getURL(AppConstant.ReportURL)}/get-machine-data-pitchtime-report`;
    return this._http.post<any>(url, reportModel, httpOptions);
  }

  public getPyroMeterReport(reportModel: ReportModel): Observable<any> {
    const url = `${this._appSettingsService.getURL(AppConstant.ReportURL)}/get-machine-data-pyrometer-report`;
    return this._http.post<any>(url, reportModel, httpOptions);
  }

  public getDailyProductionReport(reportModel: ReportModel): Observable<any> {
    const url = `${this._appSettingsService.getURL(AppConstant.ReportURL)}/get-machine-data-dailyProduction-excel-report`;
    return this._http.post<any>(url, reportModel, httpOptions);
  }

  public getDailyProductionReportChart(reportModel: ReportModel): Observable<any> {
    const url = `${this._appSettingsService.getURL(AppConstant.ReportURL)}/get-machine-data-dailyProduction-report`;
    return this._http.post<any>(url, reportModel, httpOptions);
  }

  public getAlarmReport(reportModel: ReportModel): Observable<any> {
    
    const url = `${this._appSettingsService.getURL(AppConstant.ReportURL)}/get-machine-data-daily-alarm-report`;
    return this._http.post<any>(url, reportModel, httpOptions);
  }

  
}

