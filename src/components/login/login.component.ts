/*In-Builts*/
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

/*Constant & Enums*/
import { AppConstant } from '../../constants/app.constants';
import { IconConstant } from '../../constants/icon.constant';

/*Models*/
import { DropDownModel } from '../../models/dropDownModel';
import { LoginModel } from '../../models/loginModel';
import { RolesModel } from '../../models/RolesModel';
import { RoleEnum } from '../../enums/common.enums';
import { UserModel } from '../../models/userModel';

/*Services*/
import { AppAlertService } from '../../shared/appAlert.service';
import { AppSettingsService } from '../../shared/appSetting.service';
import { AppStorageService } from '../../shared/appStorage.service';
import { CommonService } from '../../shared/common.service';
import { LoginService } from './service/login.service';
import { MenuService } from '../../components/menu/service/menu.service';
import { UserInfoService } from '../../shared/userInfo.service';
import { ValidationService } from '../validation/service/validation.service';
import { AppContextService } from '../../shared/appContext.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  /* Property Creation */
  public domains: DropDownModel[] = [];
  public errorMessage: string;
  public form: FormGroup;
  public isLoginprogressing: boolean;
  public login: LoginModel;
  public spinnerClass: string;

  constructor(
    public validation: ValidationService,
    private _appAlertService: AppAlertService,
    private _appContextService: AppContextService,
    private _appSettingsService: AppSettingsService,
    private _formBuilder: FormBuilder,
    private _menuService: MenuService,
    private _router: Router,
    private _loginService: LoginService,
    private _userInfoService: UserInfoService,
    private _storage: AppStorageService,
    private _commonService: CommonService) {
    this.spinnerClass = IconConstant.spinnerClass;
  }

  ngOnInit() {
    this.IntializeForm();
  }

  IntializeForm() {
    this.form = this._formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      domain: [null, Validators.required]
    });
    this.login = new LoginModel();
    this.loadSetting();
  }

  loadSetting() {
    this._appSettingsService.getSettings().subscribe(result => {
      this._appSettingsService.setting = result;
      this.login.domain = this._appSettingsService.getDefaultSelectedDomain();
      this._commonService.setValue(AppConstant.AppSettingKey, result);
      this.getDomains();
    });

  }

  getDomains() {
    this.domains = [];
    this._loginService.getDomain().subscribe(data => {
      for (let iRow = 0; iRow < data.length; iRow++) {
        this.domains.push({ Id: iRow.toString(), Name: data[iRow].replace('.COM', '') });
      }
    });
  }

  onSubmit() {
    this._appAlertService.reset();
    if (this.form.valid) {
      this.isLoginprogressing = true;
      this._loginService.isAuthenticated(this.login).subscribe((data: any) => {
        this._userInfoService.setUserToken(data.access_token);
        this._loginService.getUserInfo(this.login).subscribe(
          (data: UserModel) => {
            this.isLoginprogressing = false;
            if (data.Roles.length > 0) {
              this.isLoginprogressing = false;
              if (data.Id != '00000000-0000-0000-0000-000000000000') {
                if (data.IsActive) {
                  this._appContextService.setContext({});
                  this._userInfoService.set(data);
                  this._menuService.show();
                  this._appAlertService.hideError();
                  this._appAlertService.hideSuccess();               
                  this._router.navigateByUrl(this._userInfoService.getDefaultPage());
                }
                else {
                  this._appAlertService.setAlertText(AppConstant.UserNotActive, AppConstant.ErrorAlert);
                }
              }
            }
            else {
              this._appAlertService.setAlertText(AppConstant.NoRolesAssign, AppConstant.ErrorAlert);
            }
          },
          (err: HttpErrorResponse) => {
            this.isLoginprogressing = false;
            this._appAlertService.setAlertText(err.statusText, AppConstant.ErrorAlert);
          })
      },
        (err: HttpErrorResponse) => {
          this.isLoginprogressing = false;
          this._appAlertService.setAlertText(err.error.error_description, AppConstant.ErrorAlert);
        });
    }
    else {
      this.isLoginprogressing = false;
      this.validation.validateAllFormFields(this.form);
    }

  }

}
