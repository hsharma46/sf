/*In-Builts*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';;

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { PagingAction } from '../../../enums/common.enums';

/*Models*/
import { DropDownModel } from '../../../models/dropDownModel';

/*Services*/
import { AppSettingsService } from '../../../shared/appSetting.service';
import { UserInfoService } from "../../../shared/userInfo.service";



const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class cmpyPlantMappingService {
    userId: string;
    constructor(        
        private _http: HttpClient,
        private _userInfoService: UserInfoService,
        private _appsetting: AppSettingsService
      
    ) {
        this.userId = this._userInfoService.getUserIdOnBasisOfRole();
    }


    //getCompanyByCountryId(): DropDownModel[] {
    //    return this.getState();
    //}

    getPlantByCompanyId(CompanyId:string): Observable<DropDownModel[]> {
      var data = {
        'pagingAction': PagingAction.All.toString(), 'currentPage': 0, 'pageSize': this._appsetting.getPageSize()
      };
      const url = `${this._appsetting.getURL(AppConstant.PlantURL)}/get?CompanyId=${CompanyId}`;
        return this._http.post<DropDownModel[]>(url, data);
    }
   
}
