/*In-Builts*/
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';;

/*Constants & Enums*/
import { AppConstant } from '../constants/app.constants';

/*Models*/
import { DeviceGroupModel } from '../models/deviceGroupModel';

/*Service*/
import { AppSettingsService } from '../shared/appSetting.service';

@Injectable()

export class DeviceGroupService {   

    constructor(private http: HttpClient,
      private _appSettingsService: AppSettingsService) { }

    getDeviceGroup(): Observable<DeviceGroupModel[]> {
      const url = `${this._appSettingsService.getURL(AppConstant.DeviceGroupURL)}/getall`;
        return this.http.get<DeviceGroupModel[]>(url);
    }
}
