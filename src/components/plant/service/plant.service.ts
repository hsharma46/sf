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
import { PlantModel } from '../../../models/plantModel';

/*Services*/
import { AppSettingsService } from '../../../shared/appSetting.service';
import { CityService } from "../../../shared/city.service";
import { StateService } from "../../../shared/state.service";
import { UserInfoService } from "../../../shared/userInfo.service";


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PlantService {
  userId: string;
  constructor(
    private _stateService: StateService,
    private _cityService: CityService,
    private _http: HttpClient,
    private _userInfoService: UserInfoService,
    private _appSettingsService: AppSettingsService
  ) {    
    this.userId = this._userInfoService.getUserIdOnBasisOfRole();
  }

  isPlantNameExists(name: string) {
    const url = `${this._appSettingsService.getURL(AppConstant.PlantURL)}/isPlantNameExists?plantName=${name}`;
    return this._http.get(url, { responseType: 'text' });
  }

  getState(): DropDownModel[] {
    return this._stateService.getState();
  }

  getCity(stateId: string): DropDownModel[] {
    return this._cityService.getCityByStateId(stateId);
  }

  getPlantByCompnayId(companyId: string, userId: string): Observable<PlantModel[]> {
    const url = `${this._appSettingsService.getURL(AppConstant.PlantURL)}/getByCompany?CompanyId=${companyId}&UserId=${userId}`;
    return this._http.get<PlantModel[]>(url);
  }

  getPlant(): Observable<PlantModel[]> {
    var data = {
      'pagingAction': PagingAction.First.toString(), 'currentPage': 0, 'pageSize': this._appSettingsService.getPageSize()
    };
    const url = `${this._appSettingsService.getURL(AppConstant.PlantURL)}/get?userid=${this.userId}&searchText=`;
    return this._http.post<PlantModel[]>(url, data);
  }

  getPlantUsingPagingControl(_Page: number, _action: string, _text: string): Observable<PlantModel[]> {
    var data = {
      'pagingAction': _action, 'currentPage': _Page, 'pageSize': this._appSettingsService.getPageSize()
    };
    const url = `${this._appSettingsService.getURL(AppConstant.PlantURL)}/get?userid=${this.userId}&searchText=${_text}`;
    return this._http.post<PlantModel[]>(url, data);
  }

  getPlantById(id: string): Observable<PlantModel> {
    const url = `${this._appSettingsService.getURL(AppConstant.PlantURL)}/getbyid?PlantId=${id}`;
    return this._http.get<PlantModel>(url);
  }

  savePlant(plant: PlantModel) {
    plant.ModifiedBy = this._userInfoService.getUserId();
    const url = `${this._appSettingsService.getURL(AppConstant.PlantURL)}/create`;
    return this._http.post(url, plant, { responseType: 'text' });
  }

  updatePlant(plant: PlantModel) {
    plant.ModifiedBy = this._userInfoService.getUserId();
    const url = `${this._appSettingsService.getURL(AppConstant.PlantURL)}/update`;
    return this._http.put(url, plant, { responseType: 'text' });
  }
}
