/*In-Builts*/
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';;

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';

/*Models*/
import { RoleWiseNavigationModel } from '../../../models/roleWiseNavigationModel';

/*Services*/
import { AppSettingsService } from '../../../shared/appSetting.service';


@Injectable()
export class NavigationService {

    constructor(
        private http: HttpClient,
      private _appSettingsService: AppSettingsService) { }


    getAllMenuRoleWise(): Observable<RoleWiseNavigationModel[]> {
      const url = `${this._appSettingsService.getURL(AppConstant.NavigationURL)}/get`;
        return this.http.get<RoleWiseNavigationModel[]>(url);
    }

    SaveMenuRoleWise(roleId: string, moduleMenuId: string) {
        var data = {
            'RoleId': roleId,
            'ModuleMenuId': moduleMenuId
        }
      const url = `${this._appSettingsService.getURL(AppConstant.NavigationURL)}/saverole`;
        return this.http.post(url, data, { responseType: 'text' });
    }
}
