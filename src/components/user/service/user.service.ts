/*In-Builts*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';;

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { PagingAction } from '../../../enums/common.enums';

/*Models*/
import { UserModel } from '../../../models/userModel';

/*Services*/
import { AppSettingsService } from '../../../shared/appSetting.service';
import { CommonService } from '../../../shared/common.service';
import { UserInfoService } from '../../../shared/userInfo.service';


@Injectable()

export class UserService {

    constructor(private http: HttpClient,
        private userInfoService: UserInfoService,
      private _commonService: CommonService,
      private _appSettingsService: AppSettingsService
    ) { }

    getDomain(): Observable<string[]> {
      const loginURL = `${this._appSettingsService.getURL(AppConstant.UserURL)}/getdomains`;
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
        return this.http.get<string[]>(loginURL, { headers: reqHeader });
    }

    getUser(): Observable<UserModel[]> {
        var data = {
          'pagingAction': PagingAction.First.toString(), 'currentPage': 0, 'pageSize': this._appSettingsService.getPageSize()
        };
      const url = `${this._appSettingsService.getURL(AppConstant.UserURL)}/get?searchText=`;
        return this.http.post<UserModel[]>(url, data);
    }

    public getById(userId: string): Observable<UserModel> {
      const url = `${this._appSettingsService.getURL(AppConstant.UserURL)}/get?userId=${userId}`;
        return this.http.get<UserModel>(url);
    }

  getUserUsingPagingControl(_Page: number, _action: string, _text: string): Observable<UserModel[]> {
        var data = {
          'pagingAction': _action, 'currentPage': _Page, 'pageSize': this._appSettingsService.getPageSize()
        };
    const url = `${this._appSettingsService.getURL(AppConstant.UserURL)}/get?searchText=${_text}`;
        return this.http.post<UserModel[]>(url, data);
    }

    SearchByUserName(userName: string, domainId: string): Observable<UserModel[]> {
      const url = `${this._appSettingsService.getURL(AppConstant.UserURL)}/searchByUserName?userName=${userName}&domainId=${domainId}`;
        return this.http.get<UserModel[]>(url);
    }

    saveUser(userModel: UserModel) {
        let company = this._commonService.getValue(AppConstant.CompanyKey);
        userModel.Company.Id = !!!company ? '00000000-0000-0000-0000-000000000000' : company["Id"];
      const url = `${this._appSettingsService.getURL(AppConstant.UserURL)}/create`;
        return this.http.post(url, userModel, { responseType: 'text' });
    }

    UpdateUser(userModel: UserModel) {
        let company = this._commonService.getValue(AppConstant.CompanyKey);
        userModel.Company.Id = !!!company ? '00000000-0000-0000-0000-000000000000' : company["Id"];
      const url = `${this._appSettingsService.getURL(AppConstant.UserURL)}/update`;
        return this.http.put(url, userModel, { responseType: 'text' });
    }
}
