/*In-Built*/
import { Component, OnInit, Input } from '@angular/core';
/*Components*/

/*Constants & Enums*/
import { AppConstant } from '../../constants/app.constants';

/*Models*/
import { CompanyModel } from '../../models/companyModel';
import { PlantModel } from '../../models/plantModel';

/*Services*/
import { AppContextService } from '../../shared/appContext.service';
import { CommonService } from '../../shared/common.service';
import { CompanyService } from '../../shared/company.service';
import { PlantService } from '../plant/service/plant.service';
import { UserInfoService } from '../../shared/userInfo.service';
import { StateModel } from '../../models/StateModel';
import { CityModel } from '../../models/CityModel';


@Component({
  selector: 'app-cmpyPlantMapping',
  templateUrl: './cmpyPlantMapping.component.html',
  styleUrls: ['./cmpyPlantMapping.component.css']
})

export class CompanyPlantMappingComponent implements OnInit {
  public companyName: string = "";
  public companyId: string = "";
  public plantName: string = "";
  public plantId: string = "";


  //@Input() CompanyId: string = "";
  @Input() IsCompanyVisible: boolean = true;
  @Input() IsCompanyDisabled: boolean = false;

  @Input() IsPlantVisible: boolean = true;
  @Input() IsPlantDisabled: boolean = false;
  //@Output() notifyChange = new EventEmitter<any>();

  public companyList: CompanyModel[] = [];
  public plantList: PlantModel[] = [];

  public companyObject: CompanyModel;
  public plantObject: PlantModel;

  public plantError: boolean = false;
  public companyError: boolean = false;

  constructor(
    public _context: AppContextService,
    public _commonService: CommonService,
    public _companyService: CompanyService,
    public _plantService: PlantService,
    public _userInfoService: UserInfoService) {

    this.companyObject = new CompanyModel();
    this.plantObject = new PlantModel();
    debugger;
    this.companyObject = Object.assign(new CompanyModel(), this._commonService.getValue(AppConstant.CompanyKey));
    if (!!this.companyObject) {
      this.companyId = this.companyObject.Id;
      this.companyName = this.companyObject.Name;
    }
  }

  ngOnInit() {
    this.getCompanyByUserId();
  }

  getCompanyByUserId() {
    this.companyList = [];
    this.companyObject = Object.assign(new CompanyModel(), this._commonService.getValue(AppConstant.CompanyKey));
    this._companyService.getCompanyByUserId().subscribe((res: CompanyModel[]) => {
      this.companyList = res;
      if (res.length > 0) {
        if (!!this.companyObject.Id) {
          this.companyId = this.companyObject.Id;
          this._commonService.setValue(AppConstant.CompanyKey, this.companyObject);
        } else {
          this.companyId = res[0].Id;
          this._commonService.setValue(AppConstant.CompanyKey, res[0]);
        }
        if (this.IsPlantVisible) {
          this.getPlant(this.companyId);
        }
      }
      else {
        this._commonService.setValue(AppConstant.CompanyKey, {});
      }
    })
  }
  getPlant(cmpyId: string) {
    if (!!cmpyId) {
      this._plantService.getPlantByCompnayId(cmpyId, this._userInfoService.getUserId()).subscribe((res: PlantModel[]) => {
        this.plantList = res;
        if (this.plantList.length > 0) {
          let plant = Object.assign(new PlantModel(), this._context.getContextByKey(AppConstant.PlantKey));
          this.plantId = plant.Id;
          this.plantName = plant.Name;
          if (this.plantId == "") {
            this._context.setContextByKey(AppConstant.PlantKey, this.plantList[0]);
            this.plantName = this.plantList[0].Name;
            this.plantId = this.plantList[0].Id;
          }
        }
        else {
          this._context.setContextByKey(AppConstant.PlantKey, undefined);
          this.plantName = '';
          this.plantId = '';
        }

        //this.notifyChange.emit();
      })
    }
  }

  onCompanyChange() {
    this.companyObject = this.companyList.find(x => x.Id == this.companyId);
    if (this.IsPlantVisible) {
      this.getPlant(this.companyObject.Id);
    }
    this._commonService.setValue(AppConstant.CompanyKey, this.companyObject);
    //this.notifyChange.emit();
  }

  onPlantChange() {
    this._context.setContextByKey(AppConstant.PlantKey, this.plantList.find(x => x.Id == this.plantId));
    //this.notifyChange.emit();
  }

  getState(): StateModel {
    return this.companyObject.State;
  }

  getCity(): CityModel {
    return this.companyObject.City;
  }

  controlBlank() {
    var result = true;
    this.plantError = false;
    this.companyError = false;
    if (!!!this.plantId) {
      this.plantError = true;
      result = false;
    }
    if (!!!this.companyId) {
      this.companyError = true;
      result = false;
    }
    return result;
  }

  companyBlank(black: boolean) {
    this.companyError = true;
  }

  //isCompanyVisible(): boolean {
  //    let result = this._userInfoService.getUserRoles().find(x => x.Name.toLowerCase() == 'admin');
  //    return !!result ? true : false;
  //}

  //isPlantVisible(): boolean {
  //    let result = this._userInfoService.getUserRoles().find(x => x.Name.toLowerCase().indexOf('company') > -1 || x.Name.toLowerCase().indexOf('admin') > -1 );
  //    return !!result ? true : false;
  //}
}
