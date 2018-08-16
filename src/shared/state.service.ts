/*In-Builts*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';;

/*Constants & Enums*/
import { AppConstant } from '../constants/app.constants';

/*Models*/
import { DropDownModel } from '../models/dropDownModel';

/*Service*/
import { AppSettingsService } from '../shared/appSetting.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class StateService {
    stateList: DropDownModel[] = [];

    constructor(private http: HttpClient,
      private _appSettingsService: AppSettingsService) { }

    /* Subscriber method */
    getState(): DropDownModel[] {
        this.stateList = [];
        this.getStates().subscribe((data: DropDownModel[]) => {
            this.stateList.push({ Id: "", Name: "" });
            for (var i = 0; i < data.length; i++) {
                this.stateList.push(data[i]);
            }
        });
        return this.stateList;
    }

    /* Observable method */
    private getStates(): Observable<DropDownModel[]> {
      const url = `${this._appSettingsService.getURL(AppConstant.StateURL)}/get`;
        return this.http.get<DropDownModel[]>(url);
    }    
    private getStateByIds(id: string): Observable<DropDownModel[]> {
      const url = `${this._appSettingsService.getURL(AppConstant.StateURL)}/GetByCountry/${id}`;
        return this.http.get<DropDownModel[]>(url);
    }
}

