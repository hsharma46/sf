/*In-Built*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

/*Component*/
import { HeaderComponent } from '../../header/header.component';

/*Constants & Enums*/
import { PagingAction, ModuleNameEnum, RightsEnum } from '../../../enums/common.enums';
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';

/*Models*/
import { DropDownModel } from '../../../models/dropDownModel';
import { PagingModel } from '../../../models/PagingModel';
import { PlantModel } from '../../../models/plantModel';


/*Services*/
import { AppContextService } from '../../../shared/appContext.service';
import { CommonService } from '../../../shared/common.service';
import { PlantService } from '../service/plant.service';
import { UserInfoService } from '../../../shared/userInfo.service';


@Component({
  selector: 'app-plants-list',
  templateUrl: "./plant.list.component.html",
  styleUrls: ['./plant.list.component.css']
})

export class PlantList_Component implements OnInit {

  /* Property Creation */
  public displayColumns: string[] = [];
  public gridData: any = [];
  public hyperLinkColumn: string = '';
  public isLoading: boolean = true;
  public nextPage: string;
  public pageIcon: string = '';
  public pagingModel: PagingModel;
  public readAccess: boolean = false;
  public searchVisible: boolean = true;
  public updateAccess: boolean = false;
  public valueColumns: string[] = [];
  public writeAccess: boolean = false;

  constructor(private _plantService: PlantService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _context: AppContextService,
    private _userInfoService: UserInfoService,
    private _commonService: CommonService) {
    this._context.setContextByKey(AppConstant.CurrentModule, '');
    this._context.resetModuleKey();
    this.pageIcon = IconConstant.plant;

    this.pagingModel = new PagingModel();

    this.readAccess = this._userInfoService.getUserAccessStatusByModuleAndAction(ModuleNameEnum.Plant, RightsEnum.View);
    this.writeAccess = this._userInfoService.getUserAccessStatusByModuleAndAction(ModuleNameEnum.Plant, RightsEnum.Create);
    this.updateAccess = this._userInfoService.getUserAccessStatusByModuleAndAction(ModuleNameEnum.Plant, RightsEnum.Edit);

    this.displayColumns = ['Name', 'Description', 'Active', 'Created On'];
    this.valueColumns = ['Name', 'Description', 'IsActive', 'CreatedDateTime'];
    this.hyperLinkColumn = 'Name';
  }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.getPlants();
    })


  }

  /* Get All the Plants irrespective of any condition */
  getPlants() {
    this._plantService.getPlant().subscribe((data: PlantModel[]) => {
      this.gridData = [];
      this.pagingModel.HidePaging = data["NoOfPages"] > 1 ? false : true;
      this.pagingModel.TotalNoOfPages = data["NoOfPages"];
      this.pagingModel.TotalNoOfRecords = data["NoOfRecords"]
      this.pagingModel.ShowPrev = data["ShowPrevButton"];
      this.pagingModel.ShowNext = data["ShowNextButton"];
      this.pagingModel.PageIndex = data["CurrentPage"];

      for (var i = 0; i < data["Data"].length; i++) {
        this.gridData.push(data["Data"][i]);
      }
      this.isLoading = false;
    });
  }

  /* Get All the Plants Whenever user use paging control */
  getPlantByPaging(_param: any) {
    
    this.isLoading = true;
    this._plantService.getPlantUsingPagingControl(_param["pageIndex"], _param["action"], _param["text"]).subscribe((data: PlantModel[]) => {
      this.gridData = [];
      this.pagingModel.HidePaging = data["NoOfPages"] > 1 ? false : true;
      this.pagingModel.TotalNoOfPages = data["NoOfPages"];
      this.pagingModel.TotalNoOfRecords = data["NoOfRecords"]
      this.pagingModel.ShowPrev = data["ShowPrevButton"];
      this.pagingModel.ShowNext = data["ShowNextButton"];
      this.pagingModel.PageIndex = data["CurrentPage"];

      for (var i = 0; i < data["Data"].length; i++) {
        this.gridData.push(data["Data"][i]);
      }
      this.isLoading = false;
    });
  }

  /* View Specific Plant */
  viewPlant(plant: PlantModel) {    
    this._commonService.setValue(AppConstant.CompanyKey, plant.Company);
    this._context.setContextByKey(AppConstant.CurrentModule, AppConstant.PlantKey);
    this._context.setContextByKey(AppConstant.PlantKey, plant);
    this._router.navigate(['/plantoverview', plant.Id]);
  }

  /*Update Plant*/
  editPlant(plant: PlantModel) {
    debugger;
    this._commonService.setValue(AppConstant.CompanyKey, plant.Company);
    this._context.setContextByKey(AppConstant.CurrentModule, AppConstant.PlantKey);
    this._context.setContextByKey(AppConstant.PlantKey, plant);
    this._router.navigate(['plant', 'edit', plant.Id]);
  }

}
