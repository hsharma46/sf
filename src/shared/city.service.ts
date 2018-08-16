/*In-Builts*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';;

/*Models*/
import { DropDownModel } from '../models/dropDownModel';
import { AppConstant } from '../constants/app.constants';

/*Service*/
import { AppSettingsService } from '../shared/appSetting.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CityService {
    cityList: DropDownModel[] = [];

    constructor(
        private http: HttpClient,
      private _appSettingsService: AppSettingsService) { }

    /* Subscriber method */
    getCityByStateId(stateId: string): DropDownModel[] {
        this.cityList = [];
        this.getCityBystate(stateId).subscribe((data: DropDownModel[]) => {
            this.cityList.push({ Id: "", Name: "" });
            for (var i = 0; i < data.length; i++) {
                this.cityList.push(data[i]);
            }
        });
        return this.cityList;
    }

    /* Observable method */
    private getCitys(): Observable<DropDownModel[]> {
      const url = `${this._appSettingsService.getURL(AppConstant.CityURL)}/get`;
        return this.http.get<DropDownModel[]>(url);

    }
    private getCityBystate(id: string): Observable<DropDownModel[]> {
      const url = `${this._appSettingsService.getURL(AppConstant.CityURL)}/getbystate?StateId=${id}`;
        return this.http.get<DropDownModel[]>(url);
    }
}

