/*In-Built*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

/*Constants & Enums*/
import { PagingAction, ModuleNameEnum } from '../../../enums/common.enums';
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';

/*Models*/
import { DeviceModel } from '../../../models/deviceModel';
import { LineModel } from '../../../models/lineModel';
import { PagingModel } from '../../../models/PagingModel';


/*Services*/
import { AppContextService } from '../../../shared/appContext.service';
import { CommonService } from '../../../shared/common.service';
import { DeviceService } from '../../device/service/device.service';
import { UserInfoService } from '../../../shared/userInfo.service';


@Component({
    selector: 'app-line-overview',
    templateUrl: "./lineOverview.component.html",
    styleUrls: ['./lineOverview.component.css']
})

export class LineOverviewComponent implements OnInit {
    /* Property Creation */
    /*public*/
    public currentContext: any;
    public isLoading: boolean = true;
    public lineId: string = '';
    public pageIcon: string;
    public deviceList: DeviceModel[] = [];
    public deviceOrderList: DeviceModel[] = [];
    public deviceListArray: Array<DeviceModel[]> = [];
    public plantId: string = '';

    /*private*/
    private userid: string = '';

    constructor(
        private _deviceService: DeviceService,
        private _router: Router,
        private _context: AppContextService,
        private _commonService: CommonService,
        private _userInfoService: UserInfoService) {        
        this.pageIcon = IconConstant.lines;
    }

    ngOnInit() {
        this._context.setContextByKey(AppConstant.CurrentModule, AppConstant.LineKey);
        this._deviceService.getDevice().subscribe((data: DeviceModel[]) => {
            this.deviceList = data["Data"];

            this.deviceOrderList = this.deviceList.filter(x => !!x.DeviceOrder);
            if (this.deviceOrderList.length > 0) {
                this.deviceOrderList = this.deviceOrderList.sort(x => x.DeviceOrder.Order);
            }

            this.deviceOrderList = this.deviceOrderList.concat(this.deviceList.filter(x => !!!x.DeviceOrder));
            for (let iRow = 0; iRow < this.deviceOrderList.length; iRow++) {
                this.deviceListArray.push([this.deviceOrderList[iRow], iRow < this.deviceOrderList.length - 1 ? this.deviceOrderList[++iRow] : new DeviceModel()]);
            }
        });        
    }

    GotoDeviceOverview(device: any) {       
        this._context.setContextByKey(AppConstant.DeviceKey, device);   
        this._router.navigate(['/deviceoverview', device.DeviceCode]);
        
    }

    //GotoLineList() {        
    //    if (this._userInfoService.isAuthorizedInModule(ModuleNameEnum.Line)) {
    //        this._router.navigate(['/linelist']);
    //    }
    //}

    //GotoPlantList() {
    //    if (this._userInfoService.isAuthorizedInModule(ModuleNameEnum.Plant)) {
    //        this._router.navigate(['/plantlist']);
    //    }
    //}
}
