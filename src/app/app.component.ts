/*In-Builts*/
import { Component, OnChanges } from '@angular/core';

/*Services*/
import { AppAlertService } from '../shared/appAlert.service';
import { MenuService } from '../components/menu/service/menu.service';
//import { AppConfigService } from '../shared/appConfig.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnChanges {
  public menu: MenuService;
  public alert: AppAlertService;

  constructor(
    private _appAlertService: AppAlertService,
    private _menuService: MenuService) {
    this.menu = _menuService;
    this.alert = _appAlertService;    
  }


  ngOnChanges() {
  }
}
