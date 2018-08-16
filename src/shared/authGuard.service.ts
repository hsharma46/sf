import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserInfoService } from './userInfo.service';
import { MenuService } from '../components/menu/service/menu.service';
import { AppStorageService } from './appStorage.service';
import { AppConstant } from '../constants/app.constants';
import { CommonService } from '../shared/common.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private _common: CommonService,
    private _route: Router,
    private _userInfoService: UserInfoService,
    private _storage: AppStorageService,
    public menu: MenuService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // clear local storage
    if (state.url.toLowerCase().indexOf('login') != -1) {
      this.menu.hide();
      this._storage.removeStorage(AppConstant.RouteHistory);
      this._storage.removeStorage(AppConstant.loggedInUserInfoKey);
      this._storage.removeStorage(AppConstant.CommonKey);
      this._storage.removeStorage(AppConstant.AppSettingKey);
      return true;
    }

    if (this._userInfoService.isLoggednIn()) {

      //store the URL history
      if (state.url.indexOf('list') != -1 || state.url.indexOf('overview') != -1) {
        this._common.pushURLToRouteHistory(state.url);
      }

      if (this._userInfoService.isUserAdmin() || this._userInfoService.isAuthorizedInMenu(state.url)) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      this._route.navigate(["login"]);
      return false;
    }
  }
}
