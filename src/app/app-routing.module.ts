/*In-Builts*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*Componenets*/
import { AlarmReportComponent } from '../reports/InductionTempering/AlarmReport/alarmReport.component';
import { ChartJSComponent } from '../controls/charts/chartjs/chartjs.component';
import { CompanyPlantMappingComponent } from '../components/companyPlantMapping/cmpyPlantMapping.component';
import { DailyProductionReportComponent } from '../reports/InductionTempering/DailyProductionReport/dailyProductionReport.component';
import { DeviceOverviewComponent } from '../components/device/overview/deviceOverview.component';
import { DeviceComponent } from '../components/device/create_update/device.component';
import { DeviceListComponent } from '../components/device/list/deviceList.component';
import { ExcelReportComponent } from '../reports/InductionTempering/ExcelReport/excelReport.component';
import { GeneralReportComponent } from '../reports/InductionTempering/GeneralReport/generalReport.component';
import { GridComponent } from '../controls/grid/grid.component';
import { HeaderComponent } from '../components/header/header.component';
import { LineOverviewComponent } from '../components/line/overview/lineOverview.component';
import { LineComponent } from '../components/line/create_update/line.component';
import { LineList_Component } from '../components/line/_list/line.list.component';
import { LoginComponent } from '../components/login/login.component';
import { ModalComponent } from '../controls/modal_popup/modal.component';
import { MemberComponent } from '../components/member/member.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { NavigateToReportComponent } from '../components/navigateToReports/navigateReports.component';
import { ParameterComponent } from '../controls/parameter/parameter.component';
import { PitchTimeComponent } from '../reports/InductionTempering/PitchTime/pitchTime.component';
import { PlantOverviewComponent } from '../components/plant/overview/plantOverview.component';
import { PlantComponent, } from '../components/plant/create_update/plant.component';
import { PlantList_Component } from '../components/plant/_list/plant.list.component';
import { PyrometerComponent } from '../reports/InductionTempering/Pyrometer/pyrometer.component';
import { UserComponent } from '../components/user/create_update/user.component';
import { UserListComponent } from '../components/user/list/userList.component';
import { StatusCodeErrorComponent } from '../components/statusCodeError/statusCodeError.component';

/*Constant & Enums*/
import { IconConstant } from '../constants/icon.constant';

/*Component Service*/
import { LineService } from '../components/line/service/line.service';
import { LoginService } from '../components/login/service/login.service';
import { MemberService } from '../components/member/service/member.service';
import { NavigationService } from '../components/navigation/service/navigation.service';
import { PlantService } from '../components/plant/service/plant.service';
import { UserService } from '../components/user/service/user.service';

/*Directives*/
import { OnlyNumberAndComma } from '../directive/onlyNumberAndComma.directive';

/*Services*/
import { AppAlertService } from '../shared/appAlert.service';
import { AppContextService } from '../shared/appContext.service';
import { AuthGuardService } from '../shared/authGuard.service';
import { AppStorageService } from '../shared/appStorage.service';
import { CityService } from '../shared/city.service';
import { ChartService } from '../shared/chart.service';
import { CompanyService } from '../shared/company.service';
import { CountryService } from '../shared/country.service';
import { DeviceService } from '../components/device/service/device.service';
import { DeviceCategoryService } from '../shared/deviceCategory.service';
import { DeviceGroupService } from '../shared/deviceGroup.service';
import { ExcelService } from '../shared/excel.service';

import { RoleService } from '../shared/role.service';
import { ReportService } from '../shared/report.service';
import { StateService } from "../shared/state.service";
import { UserInfoService } from '../shared/userInfo.service';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'deviceoverview/:code', component: DeviceOverviewComponent, canActivate: [AuthGuardService] },
  { path: 'devicelist', component: DeviceListComponent, canActivate: [AuthGuardService] },
  { path: 'device', component: DeviceComponent, canActivate: [AuthGuardService] },
  { path: 'device/:action/:code', component: DeviceComponent, canActivate: [AuthGuardService] },
  {
    path: 'report/inductiontempering/:code', component: NavigateToReportComponent,
    children: [
      { path: '', redirectTo: 'generalreport', pathMatch: 'full' },
      { path: 'alarmreport', component: AlarmReportComponent },
      { path: 'dailyproduction', component: DailyProductionReportComponent },
      { path: 'excelreport', component: ExcelReportComponent },
      { path: 'generalreport', component: GeneralReportComponent },
      { path: 'pitchtime', component: PitchTimeComponent },
      { path: 'pyrometer', component: PyrometerComponent }
    ]
  },
  { path: 'lineoverview/:lineid', component: LineOverviewComponent, canActivate: [AuthGuardService] },
  { path: 'linelist', component: LineList_Component, canActivate: [AuthGuardService] },
  { path: 'line', component: LineComponent, canActivate: [AuthGuardService] },
  { path: 'line/:action/:id', component: LineComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
  { path: 'navigation', component: NavigationComponent, canActivate: [AuthGuardService] },
  { path: 'plantoverview/:plantid', component: PlantOverviewComponent, canActivate: [AuthGuardService] },
  { path: 'plantlist', component: PlantList_Component, canActivate: [AuthGuardService] },
  { path: 'plant', component: PlantComponent, canActivate: [AuthGuardService] },
  { path: 'plant/:action/:id', component: PlantComponent, canActivate: [AuthGuardService] },
  { path: 'userlist', component: UserListComponent, canActivate: [AuthGuardService] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuardService] },
  { path: 'user/:action/:id', component: UserComponent, canActivate: [AuthGuardService] },
  { path: 'statuscode/:code/:text', component: StatusCodeErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponent = [
  AlarmReportComponent,
  ChartJSComponent,
  CompanyPlantMappingComponent,
  OnlyNumberAndComma,
  DailyProductionReportComponent,
  DeviceComponent, DeviceListComponent, DeviceOverviewComponent,
  ExcelReportComponent,
  GeneralReportComponent,
  GridComponent,
  HeaderComponent,

  LineList_Component, LineComponent, LineOverviewComponent,
  LoginComponent,
  MemberComponent,
  ModalComponent,
  NavigationComponent,
  NavigateToReportComponent,
  ParameterComponent,
  PitchTimeComponent,
  PlantList_Component, PlantComponent, PlantOverviewComponent,
  PyrometerComponent,
  StatusCodeErrorComponent,
  UserComponent, UserListComponent]

export const routingServices = [
  AppAlertService,
  AppContextService,
  AuthGuardService,
  AppStorageService,
  CityService,
  ChartService,
  CompanyService,
  CountryService,
  DeviceCategoryService,
  DeviceGroupService,
  DeviceService,
  ExcelService,
  IconConstant,
  LineService,
  LoginService,
  MemberService,
  NavigationService,
  PlantService,
  RoleService,
  ReportService,
  StateService,
  UserService,
  UserInfoService]
