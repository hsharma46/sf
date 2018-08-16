/*In-Builts*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs';;

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { PagingAction } from '../../../enums/common.enums';

/*Models*/
import { DropDownModel } from '../../../models/dropDownModel';
import { LineModel } from '../../../models/lineModel';
import { PlantModel } from '../../../models/plantModel';

/*Services*/
import { AppContextService } from '../../../shared/appContext.service';
import { AppSettingsService } from '../../../shared/appSetting.service';
import { CityService } from "../../../shared/city.service";
import { StateService } from "../../../shared/state.service";
import { UserInfoService } from "../../../shared/userInfo.service";

@Injectable()

export class LineService {

  userId: string;
  plantId: string;
  constructor(
    private _http: HttpClient,
    private _stateService: StateService,
    private _cityService: CityService,
    private _userInfoService: UserInfoService,
    private _context: AppContextService,
    private _appSetting: AppSettingsService) {
    this.InitializeValue();
  }

  isLineNameExists(name: string) {
    const url = `${this._appSetting.getURL(AppConstant.LineURL)}/isLineNameExists?lineName=${name}`;
    return this._http.get(url, { responseType: 'text' });
  }

  getState(): DropDownModel[] {
    return this._stateService.getState();
  }

  getLine(): Observable<LineModel[]> {
    this.InitializeValue();
    var data = {
      'pagingAction': PagingAction.First.toString(), 'currentPage': 0, 'pageSize': this._appSetting.getPageSize()
    };
    const url = `${this._appSetting.getURL(AppConstant.LineURL)}/get?plantId=${this.plantId}&userid=${this.userId}&searchText=`;
    return this._http.post<LineModel[]>(url, data);
  }
  getLineById(id: string): Observable<LineModel> {
    const url = `${this._appSetting.getURL(AppConstant.LineURL)}/getbyid?Id=${id}`;
    return this._http.get<LineModel>(url);
  }

  getLineUsingPagingControl(_Page: number, _action: string, _text: string): Observable<LineModel[]> {
    this.InitializeValue();
    var data = {
      'pagingAction': _action, 'currentPage': _Page, 'pageSize': this._appSetting.getPageSize()
    };
    const url = `${this._appSetting.getURL(AppConstant.LineURL)}/get?plantId=${this.plantId}&userid=${this.userId}&searchText=${_text}`;
    return this._http.post<LineModel[]>(url, data);
  }

  saveLine(line: LineModel) {
    this.InitializeValue();
    line.ModifiedBy = this._userInfoService.getUserId();
    const url = `${this._appSetting.getURL(AppConstant.LineURL)}/create`
    return this._http.post(url, line, { responseType: 'text' })
  }
  updateLine(line: LineModel) {
    this.InitializeValue();
    line.ModifiedBy = this._userInfoService.getUserId();
    const url = `${this._appSetting.getURL(AppConstant.LineURL)}/update`
    return this._http.put(url, line, { responseType: 'text' })
  }

  private InitializeValue() {
    this.userId = this._userInfoService.getUserIdOnBasisOfRole();
    this.plantId = !!!this._context.getContextByKey(AppConstant.PlantKey) || Object.keys(this._context.getContextByKey(AppConstant.PlantKey)).length == 0 ? '' : this._context.getContextByKey(AppConstant.PlantKey)['Id'];
  }
}
