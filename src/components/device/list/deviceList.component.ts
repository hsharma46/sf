/*In-Built*/
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

/*Constants & Enums*/
import { PagingAction, ModuleNameEnum, RightsEnum } from '../../../enums/common.enums';
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';

/*Models*/
import { DropDownModel } from '../../../models/dropDownModel';
import { PagingModel } from '../../../models/PagingModel';
import { DeviceModel } from '../../../models/deviceModel';
import { ParameterModel } from '../../../models/parameterModel';


/*Services*/
import { AppContextService } from '../../../shared/appContext.service';
import { CommonService } from '../../../shared/common.service';
import { DeviceService } from '../service/device.service';
import { UserInfoService } from '../../../shared/userInfo.service';

@Component({
  selector: 'app-device-list',
  templateUrl: "./deviceList.component.html"
})

export class DeviceListComponent implements OnInit {
  /*Input property*/
  @Input() AsChild: boolean;


  /* Property Creation */
  public currentContext: any = {};
  public cloneAccess: boolean = false;
  public displayColumns: string[] = [];
  public isLoading: boolean = true;
  public gridData: DeviceModel[] = [];
  public hyperLinkColumn: string = '';
  public lineName: string = '';
  public location: string = '';
  public pageIcon: string = "";
  public plantName: string = '';
  public plantLineId: string = '';
  public pagingModel: PagingModel;
  public readAccess: boolean = true;
  public searchVisible: boolean = true;
  public updateAccess: boolean = true;
  public valueColumns: string[] = [];
  public writeAccess: boolean = true;


  constructor(private _deviceService: DeviceService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _context: AppContextService,
    private _userInfoService: UserInfoService,
    private _commonService: CommonService) {
    this.lineName = AppConstant.Lines;
    this.pageIcon = IconConstant.machine;
    this.pagingModel = new PagingModel();

    this.readAccess = this._userInfoService.getUserAccessStatusByModuleAndAction(ModuleNameEnum.Device, RightsEnum.View);
    this.writeAccess = this._userInfoService.getUserAccessStatusByModuleAndAction(ModuleNameEnum.Device, RightsEnum.Create);
    this.updateAccess = this._userInfoService.getUserAccessStatusByModuleAndAction(ModuleNameEnum.Device, RightsEnum.Edit);
    this.cloneAccess = this._userInfoService.getUserAccessStatusByModuleAndAction(ModuleNameEnum.Device, RightsEnum.Create);

    this._context.setContextByKey(AppConstant.DeviceKey, {});
    this.displayColumns = ['Code', 'Description', 'Active', 'Group', 'Created On'];//'Category',
    this.valueColumns = ['DeviceCode', 'Description', 'IsActive', 'DeviceGroup.GroupName', 'DateCreated'];//'DeviceCategory.Title~DeviceCategory.Description'
    this.hyperLinkColumn = 'DeviceCode';
  }

  ngOnInit() {
    if (this.AsChild == undefined) {      
      this._context.setContextByKey(AppConstant.CurrentModule, AppConstant.DeviceKey);
    }
    this.getDevice();
  }

  /* Get All the Devices irrespective of any condition */
  getDevice() {    
    this._deviceService.getDevice().subscribe((data: DeviceModel[]) => {
      this.gridData = [];
      this.pagingModel.HidePaging = !!data["NoOfPages"] && data["NoOfPages"] > 1 ? false : true;
      this.pagingModel.TotalNoOfPages = !!!data["NoOfPages"] ? 0 : data["NoOfPages"];
      this.pagingModel.TotalNoOfRecords = !!!data["NoOfRecords"] ? 0 : data["NoOfRecords"]
      this.pagingModel.ShowPrev = !!!data["ShowPrevButton"] ? false : data["ShowPrevButton"];
      this.pagingModel.ShowNext = !!!data["ShowNextButton"] ? false : data["ShowNextButton"];
      this.pagingModel.PageIndex = !!!data["CurrentPage"] ? 0 : data["CurrentPage"];

      for (var i = 0; i < data["Data"].length; i++) {
        this.gridData.push(data["Data"][i]);
      }
      this.isLoading = false;
    });
  }

  /* Get All the Devices Whenever user use paging control */
  getDeviceByPaging(_param: any) {
    this.isLoading = true;    
    this._deviceService.getDeviceUsingPagingControl(_param["pageIndex"], _param["action"], _param["text"]).subscribe((data: DeviceModel[]) => {
      this.gridData = [];
      this.pagingModel.HidePaging = !!data["NoOfPages"] && data["NoOfPages"] > 1 ? false : true;
      this.pagingModel.TotalNoOfPages = !!!data["NoOfPages"] ? 0 : data["NoOfPages"];
      this.pagingModel.TotalNoOfRecords = !!!data["NoOfRecords"] ? 0 : data["NoOfRecords"]
      this.pagingModel.ShowPrev = !!!data["ShowPrevButton"] ? false : data["ShowPrevButton"];
      this.pagingModel.ShowNext = !!!data["ShowNextButton"] ? false : data["ShowNextButton"];
      this.pagingModel.PageIndex = !!!data["CurrentPage"] ? 0 : data["CurrentPage"];
      for (var i = 0; i < data["Data"].length; i++) {
        this.gridData.push(data["Data"][i]);
      }
      this.isLoading = false;
    });
  }

  /* View Specific Device */
  viewDevice(device: DeviceModel) {
    this._context.setContextByKey(AppConstant.DeviceKey, device);
    this._router.navigate(['/deviceoverview', device.DeviceCode]);
  }

  /*Update Device*/
  editDevice(device: DeviceModel) {
    this._router.navigate(['device', 'edit', device.DeviceCode]);
  }

  /*Clone Device*/
  cloneDevice(device: DeviceModel) {
    this._router.navigate(['device', 'clone', device.DeviceCode]);
  }
}
