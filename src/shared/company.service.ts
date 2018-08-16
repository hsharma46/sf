/*In-Builts*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';;

/*Constants & Enums*/
import { AppConstant } from '../constants/app.constants';

/*Models*/
import { CompanyModel } from '../models/companyModel';

/*Service*/
import { AppSettingsService } from '../shared/appSetting.service';
import { UserInfoService } from './userInfo.service';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CompanyService {

    constructor(
        private http: HttpClient,
      private _appSettingsService: AppSettingsService,
        private _userInfoService: UserInfoService) { }

    
    

    //public getCompanyByCountryId(countryId: string): CompanyModel[] {
    //    let result: CompanyModel[] = [];
    //    this.getByCountryId(countryId).subscribe((res: CompanyModel[]) => {
    //        result = res;
    //    })
    //    return result;
    //}

    /* Observable method */
    public getCompany(): Observable<CompanyModel[]> {
      const url = `${this._appSettingsService.getURL(AppConstant.CompanyURL)}/get`;
        return this.http.get<CompanyModel[]>(url);

    }

    public getCompanyByUserId(): Observable<CompanyModel[]> {
      const url = `${this._appSettingsService.getURL(AppConstant.CompanyURL)}/getbyuserid?userId=${this._userInfoService.getUserId()}`;
        return this.http.get<CompanyModel[]>(url);

    }    

    public getByCountryId(countryId: string): Observable<CompanyModel[]> {
      const url = `${this._appSettingsService.getURL(AppConstant.CompanyURL)}/getbycountry?CountryId=${countryId}`;
        return this.http.get<CompanyModel[]>(url);

    }
}

