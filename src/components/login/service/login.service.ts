/*In-Builts*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';;

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';

/*Models*/
import { LoginModel } from '../../../models/loginModel';
import { UserModel } from '../../../models/userModel';

/*Services*/
import { AppSettingsService } from '../../../shared/appSetting.service';

@Injectable()

export class LoginService {

  constructor(private _httpClient: HttpClient,
    private _appSettingsService: AppSettingsService) { }

    getDomain(): Observable<string[]> {
      const loginURL = this._appSettingsService.getURL(AppConstant.UserURL) + '/getdomains';
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
        return this._httpClient.get<string[]>(loginURL, { headers: reqHeader });
    }

    isAuthenticated(login: LoginModel) {
        var data = "username=" + login.userName + "&password=" + login.password + "&grant_type=password" + "&domain=" + login.domain;
      const loginURL = this._appSettingsService.getURL(AppConstant.TokenURL);
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
        return this._httpClient.post(loginURL, data, { headers: reqHeader });
    }

    getUserInfo(login: LoginModel): Observable<UserModel> {
      const loginURL = `${this._appSettingsService.getURL(AppConstant.UserURL)}/getbyusername?username=${login.userName}&domain=${login.domain}`;
        return this._httpClient.get<UserModel>(loginURL);
    }
}
