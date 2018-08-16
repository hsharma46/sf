/*In-Builts*/
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';;
import { Router, ActivatedRoute, Params } from '@angular/router';


/*Constant & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';

/*Models*/
import { DropDownModel } from '../../../models/dropDownModel';
import { RolesModel } from '../../../models/RolesModel';
import { UserModel } from '../../../models/userModel';

/*Services*/
import { AppAlertService } from '../../../shared/appAlert.service';
import { CommonService } from '../../../shared/common.service';
import { CompanyModel } from '../../../models/companyModel';
import { RoleService } from '../../../shared/role.service';
import { UserService } from '../service/user.service';
import { ValidationService } from '../../validation/service/validation.service';
import { AppSettingsService } from '../../../shared/appSetting.service';




@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  user: UserModel;
  userId: string;
  roleId: string[] = [];
  headerText: string;
  buttonText: string;
  searchIsBlank: boolean;
  isSearchVisible: boolean;
  roleList: DropDownModel[] = [];
  selectedDomain: number;
  searchVisible: boolean = true;
  domains: DropDownModel[] = [];
  form: FormGroup;
  pageIcon: string = '';

  constructor(
    public validation: ValidationService,
    private _appSettingsService: AppSettingsService,
    private _appAlertService: AppAlertService,
    private _commonService: CommonService,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _roleService: RoleService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) {
    this.pageIcon = IconConstant.user;
    this.selectedDomain = Number(this._appSettingsService.getDefaultSelectedDomain());
  }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((param: Params) => {
      this.userId = param.get('id');
      let action = param.get('action');
      if (!!!action) {
        this.headerText = AppConstant.CreateUser;
        this.buttonText = AppConstant.Create;
        this.isSearchVisible = true;
        this.IntializeForm(new UserModel());
      } else {
        this.headerText = AppConstant.UpdateUser;
        this.buttonText = AppConstant.Update;
        this.isSearchVisible = false;
        this.getUserById(this.userId);
      }
    })
  }

  IntializeForm(_userModel: UserModel) {
    this.getRoles();
    this.getDomains();

    this.form = this._formBuilder.group({
      //role: [{ value: null, disabled: !!this.userId ? true : false }, Validators.required],
      role: [{ value: this.roleId }, Validators.required],
      email: [null, Validators.required],
      searchBox:[''],
      active: ['']
    })

    this.user = _userModel;
  }

  roleChangedEvent() {    
    let list = this.form.controls["role"].value;
    this.user.Roles = [];
    for (let i = 0; i < list.length; i++) {
      this.user.Roles.push({ Id: list[i], Name: "", DisplayName: "" });
    }
  }

  getUserById(userId: string) {
    this.user = new UserModel();
    this._userService.getById(userId).subscribe((data: UserModel) => {
      this.user.Id = data["Id"];
      this.user.FirstName = data["FirstName"];
      this.user.LastName = data["LastName"];
      this.user.FullName = data["FullName"];
      this.user.Email = data["Email"];
      this.user.UserName = data["UserName"];
      this.user.IsActive = data["IsActive"];
      for (let iCount = 0; iCount < data["Roles"].length; iCount++) {
        this.user.Roles.push({ Id: data["Roles"][iCount]["Id"], DisplayName: "", Name: "" });
        this.roleId.push(data["Roles"][iCount]["Id"]);        
      }
      this.IntializeForm(this.user);
    })    
  }

  getDomains() {
    this.domains = [];
    this._userService.getDomain().subscribe(data => {
      for (let iRow = 0; iRow < data.length; iRow++) {
        this.domains.push({ Id: iRow.toString(), Name: data[iRow].replace('.COM', '') });
      }
    });
  }

  getRoles() {
    this._roleService.getRole().subscribe((data: DropDownModel[]) => {
      this.roleList = [];
      for (var iCount = 0; iCount < data.length; iCount++) {
        this.roleList.push(data[iCount]);
      }
    });
  }

  getSearchResult(searchUserName: string, searchDomain: string) {
    this._appAlertService.reset();
    if (!!searchUserName) {
      this.searchIsBlank = false;
      this._userService.SearchByUserName(searchUserName, searchDomain).subscribe((data: UserModel[]) => {
        if (data.length == 0) {
          this._appAlertService.setAlertText(AppConstant.UserNotFoundByUserName, AppConstant.ErrorAlert);
        }
        for (var iCount = 0; iCount < data.length; iCount++) {
          this.user = data[iCount];
          if (this.user.IsAlreadyExists) {
            this.user = new UserModel();
            this._appAlertService.setAlertText(AppConstant.UserAlreadyExists, AppConstant.ErrorAlert);
          }
        }
      })
    }
    else {
      this.searchIsBlank = true;
    }
  }

  /* Form submit and reset Event */
  onSubmit(domain: number) {
    //console.log(this.form);
    this._appAlertService.reset();
    if (this.user.UserName) {
      if (this.form.valid) {
        this.user.Company = new CompanyModel();
        if (!!!this.userId) {
          this.user.UserName = this.domains[domain].Name + "/" + this.user.UserName
          this._userService.saveUser(this.user)
            .subscribe(data => {
              alert(data);
              this._router.navigateByUrl('/userlist');
            },
            error => {
              return Observable.throw(error);
            });
        }
        else {
          this._userService.UpdateUser(this.user).subscribe(data => {
            alert(data);
            this._router.navigateByUrl(this._commonService.popURLToRouteHistory());      
          },
            error => {
              return Observable.throw(error);
            });
        }
      }
      else {
        this.validation.validateAllFormFields(this.form);
      }
    }
    else {
      this._appAlertService.setAlertText('Please Search User First !', AppConstant.ErrorAlert);
    }
  }
  reset() {
    this._appAlertService.reset();
    this.form.reset();
    this.user = new UserModel();
  }
}
