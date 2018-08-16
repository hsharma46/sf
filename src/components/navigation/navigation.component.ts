/*In-Builts*/
import { Component, OnInit } from '@angular/core';

/*Constants & Enums*/
import { AppConstant } from '../../constants/app.constants';
import { IconConstant } from '../../constants/icon.constant';
import { ModuleNameEnum, RoleEnum } from '../../enums/common.enums';

/*Services*/
import { NavigationService } from './service/navigation.service';
import { RoleService } from '../../shared/role.service';

/*Models*/
import { DropDownModel } from '../../models/dropDownModel';
import { RoleWiseNavigationModel } from '../../models/roleWiseNavigationModel';


@Component({
    selector: 'app-nav',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {
    public DeviceModule: string;
    public PlantModule: string;
    public LineModule: string;
    public UserModule: string;
    public spinnerClass: string;
    public Roles: DropDownModel[] = [];
    public Modules: RoleWiseNavigationModel[] = [];
    public Loading: boolean;



    constructor(
        private _navigation: NavigationService,
        private _role: RoleService) {
        this.PlantModule = ModuleNameEnum.Plant;
        this.LineModule = ModuleNameEnum.Line;
        this.UserModule = ModuleNameEnum.User;
        this.DeviceModule = ModuleNameEnum.Device;
        this.spinnerClass = IconConstant.spinnerClass;
    }

    ngOnInit() {
        this.Loading = true;
        this._role.getRole().subscribe((data) => {
            this.Roles = data.filter(x => x.Name != RoleEnum.Admin);
        });

        this._navigation.getAllMenuRoleWise().subscribe((data) => {
            data.map(x => x.RolePermission = x.RolePermission.filter(y => y.RoleName != RoleEnum.Admin));
            this.Modules = data;            
            this.Loading = false;
        });
    };

    onCheckBoxChange(roleId: string, moduleMenuId: string, event: any) {
        this._navigation.SaveMenuRoleWise(roleId, moduleMenuId).subscribe(data => {
            let data1 = data;
        });
    }
}
