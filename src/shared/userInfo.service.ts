/*In-Builts*/
import { Injectable, OnInit } from '@angular/core';

/*Constants & Enums*/
import { AppConstant } from '../constants/app.constants';
import { RightsEnum, ModuleNameEnum } from '../enums/common.enums'

/*Models*/
import { RolesModel } from '../models/RolesModel';
import { UserModel } from '../models/userModel';
import { RoleWiseUserModuleModel } from '../models/roleWiseNavigationModel';


/*Services*/
import { AppStorageService } from './appStorage.service';
import { CommonService } from '../shared/common.service';


@Injectable()

export class UserInfoService implements OnInit {
  userInfo: UserModel;
  userRoles: RolesModel[];
  constructor(private _storage: AppStorageService,
    private _commonService: CommonService) {
    this.userInfo = new UserModel();
    this.userInfo = this._storage.getDataFromStorage(AppConstant.loggedInUserInfoKey);
  }

  ngOnInit() {

  }

  setUserToken(userToken: string) {
    this._storage.setDataInStorage(AppConstant.loggedInUserTokenKey, userToken);
  }

  set(user: UserModel) {
    this._storage.setDataInStorage(AppConstant.loggedInUserInfoKey, user);
    this._commonService.setValue(AppConstant.CompanyKey, user.Company);

    this.get();
  }

  getDefaultPage(): string {
    return this.userInfo.DefaultPage;
  }

  getUserId(): string {
    return this.userInfo.Id;
  }

  getUserName(): string {
    return this.userInfo.UserName;
  }

  getFirstName(): string {
    return this.userInfo.FirstName;
  }

  getLastName(): string {
    return this.userInfo.LastName;
  }

  getFullName(): string {
    return this.userInfo.FullName;
  }

  getUserToken(): string {
    return this._storage.getDataFromStorage(AppConstant.loggedInUserTokenKey);
  }

  getUserRoles(): RolesModel[] {
    return this.userInfo.Roles;
  }

  getUserMenus(): RoleWiseUserModuleModel[] {
    return this.userInfo.RoleWiseUserModule;
  }

  isLoggednIn(): boolean {
    return !!!this.getUserToken() ? false : true;
  }

  isAuthorizedInModule(moduleName: string): boolean {
    if (this.getUserMenus().find(x => x.ModuleName == moduleName)) {
      return true;
    }
    else {
      return false;
    }
  }

  isUserAdmin(): boolean {
    return this.userInfo.Roles.length > 0 ? this.userInfo.Roles[0].Name.toLowerCase() == 'admin' ? true : false : false;
  }

  getUserAccessStatusByModuleAndAction(moduleName: ModuleNameEnum, action: RightsEnum): boolean {
    if (this.isUserAdmin()) {
      return true;
    }
    else {
      let module = this.userInfo.RoleWiseUserModule.find(x => x.ModuleName.toLowerCase() == moduleName.toLowerCase());
      if (!!module) {
        let actionStatus = module.Menus.find(x => x.MenuName.toLowerCase().indexOf(action.toString().toLowerCase()) > -1);
        if (!!actionStatus) {
          return actionStatus.RolePermission.find(x => x.RoleDisplayName == this.userInfo.Roles[0].DisplayName).Permission;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }

  }


  isAuthorizedInMenu(menuURL: string): boolean {
    var result = false;
        
    if (menuURL.toLowerCase().indexOf('overview/') != -1) {
      menuURL = menuURL.toLowerCase().substr(0, menuURL.toLowerCase().lastIndexOf('/'));
    }
    else if (menuURL.toLowerCase().indexOf('/clone') != -1) {
      menuURL = menuURL.toLowerCase().split('/clone')[0];
    }
    else if (menuURL.toLowerCase().indexOf('/edit/') != -1) {
      menuURL = menuURL.toLowerCase().substr(0, menuURL.toLowerCase().lastIndexOf('/'));
    }    

    for (var iModuleCount = 0; iModuleCount < this.userInfo.RoleWiseUserModule.length; iModuleCount++) {
      if (this.userInfo.RoleWiseUserModule[iModuleCount].Menus.find(x => x.MenuURL == menuURL)) {
        result = this.userInfo.RoleWiseUserModule[iModuleCount].Menus.find(x => x.MenuURL == menuURL).RolePermission.find(x => x.RoleDisplayName === this.userInfo.Roles[0].DisplayName).Permission
      }
    }
    return result;
  }

  /*return Empty Guid if userRole is companyHead or Admin else return userId */
  getUserIdOnBasisOfRole(): string {
    let userName = this.getUserName();
    if (userName == "admin") {
      return '00000000-0000-0000-0000-000000000000';
    }
    else {
      return this.getUserId();
    }
  }

  private get(): void {
    this.userInfo = this._storage.getDataFromStorage(AppConstant.loggedInUserInfoKey);
  }
}
