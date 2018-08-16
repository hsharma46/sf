/*In-Builts*/
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';;

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { PagingAction } from '../../../enums/common.enums';

/*Models*/
import { MemberModel } from '../../../models/MemberModel';
import { UserModel } from '../../../models/userModel';


/*Service*/
import { AppSettingsService } from '../../../shared/appSetting.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()

export class MemberService {
  memberList: MemberModel[] = [];
  userList: MemberModel[] = [];
  constructor(
    private http: HttpClient,
    private _appSettingsService: AppSettingsService) { }

  saveMember(memberModel: MemberModel[], type: string) {
    if (AppConstant.Plant == type) {
      const url = `${this._appSettingsService.getURL(AppConstant.MemberURL)}/saveplant`;
      return this.http.post(url, memberModel, { responseType: 'text' });
    }
    else if (AppConstant.Line === type) {
      const url = `${this._appSettingsService.getURL(AppConstant.MemberURL)}/saveline`;
      return this.http.post(url, memberModel, { responseType: 'text' });
    }
    else if (AppConstant.Device === type) {
      const url = `${this._appSettingsService.getURL(AppConstant.MemberURL)}/savedevice`;
      return this.http.post(url, memberModel, { responseType: 'text' });
    }
  }

  /* Observable method */
  getMemberById(id: string, type: string): Observable<MemberModel[]> {
    if (AppConstant.Plant === type) {
      const url = `${this._appSettingsService.getURL(AppConstant.MemberURL)}/getmemberbyplant?plantId=${id}`;
      return this.http.get<MemberModel[]>(url);
    }
    else if (AppConstant.Line === type) {
      const url = `${this._appSettingsService.getURL(AppConstant.MemberURL)}/getmemberbyline?lineId=${id}`;
      return this.http.get<MemberModel[]>(url);
    }
    else if (AppConstant.Device === type) {
      const url = `${this._appSettingsService.getURL(AppConstant.MemberURL)}/getmemberbydevice?deviceCode=${id}`;
      return this.http.get<MemberModel[]>(url);
    }
  }

  searchMembers(searchText: string, type: string): Observable<UserModel[]> {
    if (AppConstant.Plant === type) {
      const url = `${this._appSettingsService.getURL(AppConstant.MemberURL)}/searchplantmember?searchText=${searchText}`;
      return this.http.get<UserModel[]>(url);
    }
    else if (AppConstant.Line === type) {
      const url = `${this._appSettingsService.getURL(AppConstant.MemberURL)}/searchlinemember?searchText=${searchText}`;
      return this.http.get<UserModel[]>(url);
    }
    else if (AppConstant.Device === type) {
      const url = `${this._appSettingsService.getURL(AppConstant.MemberURL)}/searchdevicemember?searchText=${searchText}`;
      return this.http.get<UserModel[]>(url);
    }
    
  }
}
