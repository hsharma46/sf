/*In-Builts*/
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';;

/*Constants & Enums*/
import { AppConstant } from '../constants/app.constants';

/*Models*/
import { DropDownModel } from '../models/dropDownModel';

/*Service*/
import { AppSettingsService } from '../shared/appSetting.service';

@Injectable()

export class DeviceCategoryService {   

    constructor(private http: HttpClient,
      private _appSettingsService: AppSettingsService) { }

    getCategory(): Observable<DropDownModel[]> {
      const url = `${this._appSettingsService.getURL(AppConstant.DeviceCategoryURL)}/getall`;
        return this.http.get<DropDownModel[]>(url);
    }
}
