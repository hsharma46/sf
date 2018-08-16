/*In-Builts*/
import { Injectable } from '@angular/core'

/*Constant & Enums*/
import { AppConstant } from '../constants/app.constants';

/*Services*/
import { AppStorageService } from './appStorage.service'

@Injectable()
export class CommonService {
  public commonData: any = {};
  constructor(private _storage: AppStorageService) {
  }

  setValue(key: string, value: any) {
    this.commonData = this._storage.getDataFromStorage(AppConstant.CommonKey) || {};
    this.commonData[key] = value;
    this.commonData = this._storage.setDataInStorage(AppConstant.CommonKey, this.commonData);
  }

  getValue(key: string): string {
    this.commonData = this._storage.getDataFromStorage(AppConstant.CommonKey)
    return !!!this.commonData ? '' : this.commonData[key];
  }

  getObject(): any {
    return this._storage.getDataFromStorage(AppConstant.CommonKey);
  }

  private getPreviousURL(): string {
    var routeArray = this._storage.getDataFromStorage(AppConstant.RouteHistory) || [];
    return routeArray.length > 0 ? routeArray[routeArray.length - 1] : "";
  }

  pushURLToRouteHistory(url: string) {
    var routeArray = this._storage.getDataFromStorage(AppConstant.RouteHistory) || [];
    routeArray.push(url);
    this._storage.setDataInStorage(AppConstant.RouteHistory, routeArray);
  }

  popURLToRouteHistory(): string {
    var previousURL = this.getPreviousURL();
    var routeArray = this._storage.getDataFromStorage(AppConstant.RouteHistory) || [];
    routeArray.pop();
    this._storage.setDataInStorage(AppConstant.RouteHistory, routeArray);

    return previousURL;
  }

  getDateInYYYY_MM_DD_HH_MM_SS(date: Date, days: number = 0) {
    date = new Date(date);
    date.setDate(date.getDate() + (!!days ? days : 0));
    var result = "";
    result = date.getFullYear() + "-" + (date.getMonth() > 8 ? '' : '0') + (date.getMonth() + 1) + "-" + (date.getDate() > 9 ? '' : '0') + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() > 9 ? '' : '0') + date.getMinutes() + ":00";
    return result;
  }

  getDateInYYYY_MM_DD(date: Date, days: number = 0) {
    date = new Date(date);
    date.setDate(date.getDate() + (!!days ? days : 0));
    var result = "";
    result = date.getFullYear() + "-" + (date.getMonth() > 8 ? '' : '0') + (date.getMonth() + 1) + "-" + (date.getDate() > 9 ? '' : '0') + date.getDate();
    return result;
  }
}
