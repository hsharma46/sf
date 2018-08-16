/*In-Builts*/
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

/*Constants  & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';
import { PagingAction, ModuleNameEnum, RightsEnum } from '../../../enums/common.enums';

/*Models*/
import { DropDownModel } from '../../../models/dropDownModel';
import { LineModel } from '../../../models/lineModel';
import { PagingModel } from '../../../models/PagingModel';


/*Services*/
import { AppContextService } from '../../../shared/appContext.service';
import { CommonService } from '../../../shared/common.service';
import { LineService } from '../service/line.service';
import { UserInfoService } from '../../../shared/userInfo.service';



@Component({
  selector: 'app-lines-list',
  templateUrl: "./line.list.component.html"
})

export class LineList_Component implements OnInit {
  /*Input property*/
  @Input() AsChild: boolean;

  /* Property Creation */
  public currentContext: any = {};
  public displayColumns: string[] = [];
  public isLoading: boolean = true;
  public gridData: LineModel[] = [];
  public hyperLinkColumn: string = '';
  public lineName: string = '';
  public location: string = '';
  public pageIcon: string = "";
  public plantName: string = '';
  public plantId: string = '';
  public pagingModel: PagingModel;
  public readAccess: boolean = true;
  public searchVisible: boolean = true;
  public updateAccess: boolean = true;
  public valueColumns: string[] = [];
  public writeAccess: boolean = true;


  constructor(private _lineService: LineService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _context: AppContextService,
    private _commonService: CommonService,
    private _userInfoService: UserInfoService) {
    this.lineName = AppConstant.Lines;
    this.pageIcon = IconConstant.lines;
    this.pagingModel = new PagingModel();

    this.readAccess = this._userInfoService.getUserAccessStatusByModuleAndAction(ModuleNameEnum.Line, RightsEnum.View);
    this.writeAccess = this._userInfoService.getUserAccessStatusByModuleAndAction(ModuleNameEnum.Line, RightsEnum.Create);
    this.updateAccess = this._userInfoService.getUserAccessStatusByModuleAndAction(ModuleNameEnum.Line, RightsEnum.Edit);

    this.displayColumns = ['Name', 'Description', 'Plant Name', 'Active', 'Created On'];
    this.valueColumns = ['Name', 'Description', 'Plant.Name', 'IsActive', 'CreatedDateTime'];
    this.hyperLinkColumn = 'Name';
  }

  ngOnInit() {
    if (this.AsChild == undefined) {
      this._context.setContextByKey(AppConstant.CurrentModule, AppConstant.LineKey);
      this._context.resetModuleKey();
    }
    this.getLines();
  }

  /* Get All the Lines irrespective of any condition */
  getLines() {
    this._lineService.getLine().subscribe((data: LineModel[]) => {
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

  /* Get All the Lines Whenever user use paging control */
  getLineByPaging(_param: any) {
    this.isLoading = true;
    this._lineService.getLineUsingPagingControl(_param["pageIndex"], _param["action"], _param["text"]).subscribe((data: LineModel[]) => {
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

  /* View Specific Line */
  viewLine(line: LineModel) {
    this._commonService.setValue(AppConstant.CompanyKey, line.Plant.Company);
    this._context.setContextByKey(AppConstant.PlantKey, line["Plant"]);
    this._context.setContextByKey(AppConstant.LineKey, line);
    this._router.navigate(['/lineoverview', line.Id]);
  }

  /*Update Line*/
  editLine(lineModel: LineModel) {
    this._commonService.setValue(AppConstant.CompanyKey, lineModel.Plant.Company);
    this._context.setContextByKey(AppConstant.PlantKey, lineModel["Plant"]);
    this._context.setContextByKey(AppConstant.LineKey, lineModel);
    this._router.navigate(['line', 'edit', lineModel.Id]);
  }
}
