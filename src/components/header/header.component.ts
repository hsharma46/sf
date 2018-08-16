/*In-Built*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

/*Components*/
import { CompanyPlantMappingComponent } from '../companyPlantMapping/cmpyPlantMapping.component';

/*Constants & Enums*/
import { AppConstant } from '../../constants/app.constants';
import { IconConstant } from '../../constants/icon.constant';
import { ModuleNameEnum } from '../../enums/common.enums';

/*Models*/
import { CompanyModel } from '../../models/companyModel';
import { LineModel } from '../../models/lineModel';
import { PlantModel } from '../../models/plantModel';

/*Services*/
import { AppContextService } from '../../shared/appContext.service';
import { CommonService } from '../../shared/common.service';
import { CompanyService } from '../../shared/company.service';
import { PlantService } from '../plant/service/plant.service';
import { UserInfoService } from '../../shared/userInfo.service';




@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
    @ViewChild('cpMapping') cpMapping: CompanyPlantMappingComponent;

    public currentContext: any;
    public currentModule: string;

    public companyIcon: string = "";
    public companyName: string = "";
    public countryName: string = "";

    public lineIcon: string = "";
    public lineName: string = "";
    public lineId: string = "";

    public locationIcon: string = "";
    public location: string = "";

    public plantIcon: string = "";
    public plantName: string = "";
    public plantId: string = "";


    constructor(
        public _context: AppContextService,
        public _commonService: CommonService,
        public _router: Router,
        public _userInfoService: UserInfoService) {
        this.companyIcon = IconConstant.company;
        this.lineIcon = IconConstant.line;
        this.plantIcon = IconConstant.plant;
        this.locationIcon = IconConstant.location;

        //this.currentContext = this._context.getContext();
    }

    ngOnInit() {
        this.currentModule = !!!this._context.getContextByKey(AppConstant.CurrentModule) ? '' : this._context.getContextByKey(AppConstant.CurrentModule);
        this.update();
    }

    GotoPlantOverview() {
        if (this._userInfoService.isAuthorizedInModule(ModuleNameEnum.Line)) {
            this._router.navigate(['/plantoverview', this.plantId]);  
        }
    }

    GotoPlantList() {
        if (this._userInfoService.isAuthorizedInModule(ModuleNameEnum.Plant)) {            
            this._router.navigate(['/plantlist']);        
        }
    }

    update() {
        this.currentContext = this._context.getContext();
        this.reset();
        if (this.currentModule == ModuleNameEnum.Plant) {
            this.getPlant();
        }
        else if (this.currentModule == ModuleNameEnum.Line) {
            this.getLine();
            this.getPlant();
        }
        else {
            this.getCompany();
        }
    }    

    private getCompany() {        
        let company = Object.assign(new CompanyModel(), this._commonService.getValue(AppConstant.CompanyKey));
        if (!!company) {
            this.companyName = company.Name;
            this.countryName = company.Country["Name"];
        }
    }
    private getLine() {        
        if (!!this.currentContext.Line) {
            this.lineName = this.currentContext.Line.Name;
            this.lineId = this.currentContext.Line.Id;
        }
    }
    private getPlant() {
        if (!!this.currentContext.Plant) {
            this.plantName = this.currentContext.Plant.Name;
            this.plantId = this.currentContext.Plant.Id;
            this.location = ""//this.currentContext.Plant.City.Name + ',' + this.currentContext.Plant.State.Name;
        }
    }

    private reset() {
        this.companyName = '';
        this.lineName = '';
        this.plantName = '';
    }
}
