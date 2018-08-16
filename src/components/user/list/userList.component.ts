/*In-Builts*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';
import { PagingAction, ModuleNameEnum, RightsEnum } from '../../../enums/common.enums';

/*Models*/
import { UserModel } from '../../../models/userModel';
import { PagingModel } from '../../../models/PagingModel';

/*Services*/
import { UserService } from '../service/user.service';
import { UserInfoService } from '../../../shared/userInfo.service';




@Component({
  selector: 'app-user-list',
  templateUrl: './userList.component.html',
  styleUrls: ['./userList.component.css']
})

export class UserListComponent implements OnInit {
  /* Property Creation */
  public displayColumns: string[] = [];
  public isLoading: boolean = true;
  public gridData: UserModel[] = [];
  public pageIcon: string = "";
  public pagingModel: PagingModel;
  public readAccess: boolean = true;
  public searchVisible: boolean = true;
  public updateAccess: boolean = true;
  public valueColumns: string[] = [];
  public writeAccess: boolean = true;


  constructor(
    private _router: Router,
    private _userService: UserService,
    private _userInfoService: UserInfoService) {
    this.pagingModel = new PagingModel();
    this.readAccess = this._userInfoService.getUserAccessStatusByModuleAndAction(ModuleNameEnum.User, RightsEnum.View);
    this.writeAccess = this._userInfoService.getUserAccessStatusByModuleAndAction(ModuleNameEnum.User, RightsEnum.Create);
    this.updateAccess = this._userInfoService.getUserAccessStatusByModuleAndAction(ModuleNameEnum.User, RightsEnum.Edit);
    this.pageIcon = IconConstant.users;
    this.displayColumns = ['Name', 'EIN', 'EMail', 'Roles', 'Active', 'Created On'];
    this.valueColumns = ['FullName', 'UserName', 'Email', 'RoleNames', 'IsActive', 'CreatedDateTime']

  }

  ngOnInit() {
    this.getUsers();
  }

  /* Get All the User */
  getUsers() {
    this._userService.getUser().subscribe((data: UserModel[]) => {
      this.gridData = [];
      this.pagingModel.HidePaging = data["NoOfPages"] > 1 ? false : true;
      this.pagingModel.TotalNoOfPages = data["NoOfPages"];
      this.pagingModel.TotalNoOfRecords = data["NoOfRecords"]
      this.pagingModel.ShowPrev = data["ShowPrevButton"];
      this.pagingModel.ShowNext = data["ShowNextButton"];
      this.pagingModel.PageIndex = data["CurrentPage"];

      for (var i = 0; i < data["Data"].length; i++) {
        this.gridData.push(data["Data"][i]);
        this.gridData[i].RoleNames = this.gridData[i].Roles.map(function (a) { return a.DisplayName }).toString();        
      }

      this.isLoading = false;
    });
  }

  /* Get All the User Whenever user use paging control */
  getUserByPaging(_param: any) {
    this.isLoading = true;
    this._userService.getUserUsingPagingControl(_param["pageIndex"], _param["action"], _param["text"]).subscribe((data: UserModel[]) => {
      this.gridData = [];
      this.pagingModel.HidePaging = data["NoOfPages"] > 1 ? false : true;
      this.pagingModel.TotalNoOfPages = data["NoOfPages"];
      this.pagingModel.TotalNoOfRecords = data["NoOfRecords"]
      this.pagingModel.ShowPrev = data["ShowPrevButton"];
      this.pagingModel.ShowNext = data["ShowNextButton"];
      this.pagingModel.PageIndex = data["CurrentPage"];

      for (var i = 0; i < data["Data"].length; i++) {
        this.gridData.push(data["Data"][i]);
        this.gridData[i].RoleNames = this.gridData[i].Roles.map(function (a) { return a.DisplayName }).toString();
      }
      this.isLoading = false;
    });
  }

  /*Update User*/
  editUser(userModel: UserModel) {
    this._router.navigate(['user', 'edit', userModel.Id]);
  }
}
