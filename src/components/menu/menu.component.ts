/*In-Builts*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/*Constants & Enums*/
import { AppConstant } from '../../constants/app.constants';

/*Services*/
import { AppStorageService } from '../../shared/appStorage.service';
import { MenuService } from './service/menu.service';
import { UserInfoService } from '../../shared/userInfo.service';
import { RoleWiseUserModuleModel, RoleWiseUserMenuModel } from '../../models/roleWiseNavigationModel';
import { DeviceModel } from '../../models/deviceModel';
import { AppSettingsService } from '../../shared/appSetting.service';


@Component({
  selector: 'nav-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {
  modules: RoleWiseUserModuleModel[] = [];
  device: DeviceModel;
   

  constructor(
    public menu: MenuService,
    public userInfoService: UserInfoService,
    private _appSettingsService: AppSettingsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _storage: AppStorageService) {
    this.device = new DeviceModel();
    // only check url here because i want to hide all other menu then report when report page is open
    this.modules = window.location.href.indexOf('/report/') == -1 ? this.userInfoService.getUserMenus():[];    
  }

  ngOnInit() { };
  visibleMenuOnly(menus: RoleWiseUserMenuModel[]): RoleWiseUserMenuModel[] {
    return menus.filter(x => x.Visible);
  }

  logout() {
    this._router.navigate(['login']);
  }
}
