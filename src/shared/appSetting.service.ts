import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { AppConstant } from 'src/constants/app.constants';
import { AppSettings } from '../models/appSettingModel';
import { Observable } from "rxjs";
import 'rxjs/add/observable/of';
import { CommonService } from 'src/shared/common.service';

@Injectable()
export class AppSettingsService {

  public setting: AppSettings

  constructor(private http: HttpClient,
    private _commonService: CommonService) {
    this.setting = new AppSettings();
  }

  getURL(path: string): string {
    if (!!this.setting.ServerIP) {
      return this.setting.ServerIP + path;
    }
    else {
      this.setAppSetting();
      return this.setting.ServerIP + path;
    }
  }

  getPageSize(): number {
    if (!!this.setting.PagingSize) {
      return this.setting.PagingSize;
    }
    else {
      this.setAppSetting();
      return this.setting.PagingSize;
    }
  }

  getSliderStep(): number {
    if (!!this.setting.SliderStep) {
      return this.setting.SliderStep;
    }
    else {
      this.setAppSetting();
      return this.setting.SliderStep;
    }
  }

  getDefaultSelectedDomain(): string {
    if (!!this.setting.SelectedDomain) {
      return this.setting.SelectedDomain;
    }
    else {
      this.setAppSetting();
      return this.setting.SelectedDomain;
    }
  }

  getSliderDefaultValue(): number {
    if (!!this.setting.SliderDefaultValue) {
      return this.setting.SliderDefaultValue;
    }
    else {
      this.setAppSetting();
      return this.setting.SliderDefaultValue;
    }
  }

  getSettings(): Observable<any> {
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this.http.get("./assets/config.json", { headers: reqHeader })
  }

  private setAppSetting() {
    this.setting = Object.assign(new AppSettings(), this._commonService.getValue(AppConstant.AppSettingKey));
  }
} 
