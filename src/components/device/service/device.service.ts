/*In-Builts*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { PagingAction } from '../../../enums/common.enums';

/*Models*/
import { DeviceModel } from '../../../models/deviceModel';
import { DropDownModel } from '../../../models/dropDownModel';
import { LineModel } from '../../../models/lineModel';
import { PlantModel } from '../../../models/plantModel';

/*Services*/
import { AppContextService } from '../../../shared/appContext.service';
import { UserInfoService } from "../../../shared/userInfo.service";
import { AppSettingsService } from '../../../shared/appSetting.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'version': '1' })
};
@Injectable()

export class DeviceService {
  userId: string;
  plantId: string;
  lineId: string;
  currentModule: string;
  constructor(
    private _http: HttpClient,
    private _userInfoService: UserInfoService,
    private _context: AppContextService,
    private _appsetting: AppSettingsService
  ) {
    this.InitializeValue();
  }



  getDevice(): Observable<DeviceModel[]> {
    this.InitializeValue();
    var data = {
      'pagingAction': PagingAction.First.toString(), 'currentPage': 0, 'pageSize': this._appsetting.getPageSize()
    };

    if (this.currentModule === AppConstant.DeviceKey || this.currentModule === "") {
      const url = `${this._appsetting.getURL(AppConstant.DeviceURL)}/getdevices?userId=${this.userId}&searchText=`;
      return this._http.post<DeviceModel[]>(url, data, httpOptions);
    }
    else if (this.lineId != '' && this.currentModule === AppConstant.LineKey) {
      //data.pagingAction = PagingAction.All;
      const url = `${this._appsetting.getURL(AppConstant.DeviceURL)}/getdevicebyline?lineId=${this.lineId}&searchText=`;
      return this._http.post<DeviceModel[]>(url, data, httpOptions);
    }
    else if (this.plantId != '' && this.currentModule === AppConstant.PlantKey) {
      //data.pagingAction = PagingAction.All;
      const url = `${this._appsetting.getURL(AppConstant.DeviceURL)}/getdevicebyPlant?plantId=${this.plantId}&searchText=`;
      return this._http.post<DeviceModel[]>(url, data, httpOptions);
    }
  }

  getDeviceUsingPagingControl(_Page: number, _action: string,_text:string): Observable<DeviceModel[]> {
    this.InitializeValue();
    var data = {
      'pagingAction': _action, 'currentPage': _Page, 'pageSize': this._appsetting.getPageSize()
    };
    if (this.currentModule === AppConstant.DeviceKey || this.currentModule === "") {
      const url = `${this._appsetting.getURL(AppConstant.DeviceURL)}/getdevices?userId=${this.userId}&searchText=${_text}`;
      return this._http.post<DeviceModel[]>(url, data, httpOptions);
    }
    else if (this.lineId != '' && this.currentModule === AppConstant.LineKey) {
      const url = `${this._appsetting.getURL(AppConstant.DeviceURL)}/getdevicebyline?lineId=${this.lineId}&searchText=${_text}`;
      return this._http.post<DeviceModel[]>(url, data, httpOptions);
    }
    else if (this.plantId != '' && this.currentModule === AppConstant.PlantKey) {
      const url = `${this._appsetting.getURL(AppConstant.DeviceURL)}/getdevicebyPlant?plantId=${this.plantId}&searchText=${_text}`;
      return this._http.post<DeviceModel[]>(url, data, httpOptions);
    }
  }

  isDeviceCodeExists(code: string): Observable<any> {
    const url = `${this._appsetting.getURL(AppConstant.DeviceURL)}/isDeviceCodeExists?deviceCode=${code}`;
    return this._http.get(url, { responseType: 'text', headers: new HttpHeaders({ 'version': '1' }) });
  }

  getDeviceByCode(code: string): Observable<DeviceModel> {
    const url = `${this._appsetting.getURL(AppConstant.DeviceURL)}/getbycode?deviceCode=${code}`;
    return this._http.get<DeviceModel>(url, httpOptions);
  }

  saveDevice(device: DeviceModel) {
    this.InitializeValue();
    device.ModifiedBy = this._userInfoService.getUserId();
    const url = `${this._appsetting.getURL(AppConstant.DeviceURL)}/create?plantId=${this.plantId}&lineId=${this.lineId}`
    return this._http.post(url, device, { responseType: 'text', headers: new HttpHeaders({ 'version': '1' }) })
  }
  updateDevice(device: DeviceModel) {
    this.InitializeValue();
    device.ModifiedBy = this._userInfoService.getUserId();
    const url = `${this._appsetting.getURL(AppConstant.DeviceURL)}/update?plantId=${this.plantId}&lineId=${this.lineId}`
    return this._http.put(url, device, { responseType: 'text', headers: new HttpHeaders({ 'version': '1' }) })
  }

  private InitializeValue() {
    this.userId = this._userInfoService.getUserIdOnBasisOfRole();
    this.currentModule = !!!this._context.getContextByKey(AppConstant.CurrentModule) ? '' : this._context.getContextByKey(AppConstant.CurrentModule);
    this.plantId = !!!this._context.getContextByKey(AppConstant.PlantKey) || Object.keys(this._context.getContextByKey(AppConstant.PlantKey)).length == 0 ? '' : this._context.getContextByKey(AppConstant.PlantKey)['Id'];
    this.lineId = !!!this._context.getContextByKey(AppConstant.LineKey) || Object.keys(this._context.getContextByKey(AppConstant.LineKey)).length == 0 ? '' : this._context.getContextByKey(AppConstant.LineKey)['Id'];
  }
}
