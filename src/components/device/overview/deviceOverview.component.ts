/*In-Built*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

/*Constants & Enums*/
import { PagingAction, ModuleNameEnum } from '../../../enums/common.enums';
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';

/*Models*/
import { DeviceModel } from '../../../models/deviceModel';


/*Services*/
import { AppContextService } from '../../../shared/appContext.service';
import { CommonService } from '../../../shared/common.service';
import { DeviceService } from '../../device/service/device.service';
import { UserInfoService } from '../../../shared/userInfo.service';



@Component({
    selector: 'app-device-overview',
    templateUrl: "./deviceOverview.component.html",
    styleUrls: ['./deviceOverview.component.css']
})

export class DeviceOverviewComponent implements OnInit {
    /* Property Creation */
    /*public*/
    public currentContext: any;
    public deviceCode: string = '';
    public device: DeviceModel;
    public Loading: boolean = false;
    public lineId: string = '';
    public lineName: string = '';
    public pageIcon: string;
    public plantIcon: string;
    public reportLocation: string="#";
    public reportIcon: string;
    public spinnerClass: string;

    /*private*/
    private userid: string = '';

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _deviceService: DeviceService,
        private _router: Router,
        private _context: AppContextService,
        private _userInfoService: UserInfoService,
        private _commonService: CommonService) {
        this.device = new DeviceModel();
        this.currentContext = this._context.getContext();
        this.pageIcon = IconConstant.machine;
        this.plantIcon = IconConstant.plant;
        this.reportIcon = IconConstant.report;
        this.spinnerClass = IconConstant.spinnerClass;        
    }

    ngOnInit() {        
        this._context.setContextByKey(AppConstant.CurrentModule, AppConstant.DeviceKey);
        this.deviceCode = this._activatedRoute.snapshot.params["code"];
        this.getDeviceById(this.deviceCode);
        this.reportLocation = "#/report/inductionTempering/"+this.deviceCode;
    }

    /* Getting Existing Device On basis of Device Code */
    getDeviceById(code: string) {
        this.device = new DeviceModel();
        this._deviceService.getDeviceByCode(code).subscribe((data: DeviceModel) => {
            this.device = data;            
            this.Loading = true;
        });
    }


    getDerivedParameter() {
        return this.device.ParameterModel.filter(x => x.IsDerivedParameter);
    }
    getNonDerivedParameter() {
        return this.device.ParameterModel.filter(x => x.IsDerivedParameter == false);
    }

    GotoLineList() {
        if (this._userInfoService.isAuthorizedInModule(ModuleNameEnum.Line)) {
            this._router.navigate(['/linelist']);
        }
    }

    GotoPlantList() {
        if (this._userInfoService.isAuthorizedInModule(ModuleNameEnum.Plant)) {
            this._router.navigate(['/plantlist']);
        }
    }
}
