/*In-Built*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/*Components*/

/*Constants & Enums*/
import { AppConstant } from '../../constants/app.constants';

/*Models*/
import { DeviceModel } from '../../models/deviceModel';

/*Services*/
import { AppContextService } from '../../shared/appContext.service';
import { AppSettingsService } from '../../shared/appSetting.service';
import { DeviceService } from '../device/service/device.service';
import { UserInfoService } from '../../shared/userInfo.service';
import { MenuService } from 'src/components/menu/service/menu.service';
import { AppStorageService } from 'src/shared/appStorage.service';

@Component({
  selector: 'app-navigate-report',
  templateUrl: './navigateReports.component.html',
  styleUrls: ['./navigateReports.component.css']
})

export class NavigateToReportComponent implements OnInit {
  public device: DeviceModel;
  public deviceCode: string = '';

  constructor(
    private _context: AppContextService,
    private _activatedRoute: ActivatedRoute,
    private _appSettingsService: AppSettingsService,
    private _router: Router,
    private _deviceService: DeviceService,
    public userInfoService: UserInfoService,
    public menu: MenuService,
    private _storage: AppStorageService) {
    this.device = new DeviceModel();

  }
  ngOnInit() {
    this._appSettingsService.getSettings().subscribe(result => {
      this._appSettingsService.setting = result;
      this.deviceCode = this._activatedRoute.snapshot.params["code"];
      this.getDeviceById(this.deviceCode);
    });

  }

  getDeviceById(code: string) {
    this.device = new DeviceModel();
    this._deviceService.getDeviceByCode(code).subscribe((data: DeviceModel) => {
      this.device = data;
      this._context.setContextByKey(AppConstant.DeviceKey, data);
    });
  }

  OpenReport(routerName: string) {
    this._router.navigate([routerName], { relativeTo: this._activatedRoute });
  }

  logout() {    
    this._router.navigate(['login']);
  }
}
