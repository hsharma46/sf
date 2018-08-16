export class AppConstant {

  /* API URL Constants*/
  public static get TokenURL(): string { return "/token" };
  public static get CityURL(): string { return "/api/city" };
  public static get CompanyURL(): string { return "/api/company" };
  public static get CountryURL(): string { return "/api/country" };
  public static get DeviceURL(): string { return "/api/device" };
  public static get DeviceCategoryURL(): string { return "/api/devicecategory" };
  public static get DeviceGroupURL(): string { return "/api/deviceGroup" };
  public static get LineURL(): string { return "/api/line" };
  public static get UserURL(): string { return "/api/user" };
  public static get MemberURL(): string { return "/api/member" };
  public static get MakerURL(): string { return "/api/maker" };
  public static get ModelURL(): string { return "/api/model" };
  public static get PlantURL(): string { return "/api/plant" };
  public static get RoleURL(): string { return "/api/role" };
  public static get StateURL(): string { return "/api/state" };
  public static get NavigationURL(): string { return "/api/rolewisemodules" };
  public static get ReportURL(): string { return '/api/data' };


  /*Local Storage Key Names*/
  public static get loggedInUserInfoKey(): string { return "UserInfo" };
  public static get loggedInUserContextKey(): string { return "UserContext" };
  public static get loggedInUserTokenKey(): string { return "userToken" };  
  

  /*Context Key Name*/
  public static get PerviousURL(): string { return "previous" };
  public static get DeviceKey(): string { return "Device" };
  public static get PlantKey(): string { return "Plant" };
  public static get LineKey(): string { return "Line" };
  public static get CurrentModule(): string { return "CurrentModule" };
  public static get AppSettingKey(): string { return "AppSetting" };
  public static get RouteHistory(): string { return "routeHistory" };

  /*Json Object PropertyName*/
  public static get CompanyKey(): string { return "Company" };
  public static get CommonKey(): string { return "Common" };

  /* Member Type Line or Plant or company */
  public static get Plant(): string { return "Plant" };
  public static get Line(): string { return "Line" };
  public static get Lines(): string { return "Lines" };
  public static get Device(): string { return "Device" };

  /*Alert Constant*/
  public static get SuccessAlert(): string { return "Success" };
  public static get ErrorAlert(): string { return "Error" };

  /*PageHeading Constant*/
  /*Line*/
  public static get CreateLine(): string { return "Create Line" };
  public static get UpdateLine(): string { return "Update Line" };

  /*Machine*/
  public static get CreateMachine(): string { return "Create Machine" };
  public static get UpdateMachine(): string { return "Update Machine" };


  /*Plant*/
  public static get CreatePlant(): string { return "Create Plant" };
  public static get UpdatePlant(): string { return "Update Plant" };

  /*User*/
  public static get CreateUser(): string { return "Create User" };
  public static get UpdateUser(): string { return "Update User" };

  /*Button Action Text Constant*/
  public static get Create(): string { return "Create" };
  public static get Update(): string { return "Update" };
  public static get ExportToExcel(): string { return "Export to Excel" };
  public static get Submit(): string { return "Submit" };
  public static get Edit(): string { return "Edit" };
  public static get Clone(): string { return "Clone" };
  public static get Search(): string { return "Search" };

  /*chart Line Color*/
  public static get blueColor(): string { return "#072baf" };
  public static get greenColor(): string { return "#308803" };
  public static get defaultChartColor(): string { return "#ffc107" };
  public static get minColor(): string { return "red" };
  public static get maxColor(): string { return "red" };

  /*Validation Messages Constants*/
  public static get DeviceCodeAlreadyExists(): string { return "Device Code Already Exists !" };
  public static get UserAlreadyExists(): string { return "User Already Exist, Please Search another user !" };
  public static get UserNotFoundByUserName(): string { return "No User Exist in this domin with given user name !" };
  public static get UserNotActive(): string { return "User Is Not Active. Please Contact System Administrator !" };
  public static get NoRolesAssign(): string { return "No Role Assign to User. Please Contact System Administrator !!" };
  public static get wrongJsonData(): string { return "Please Enter Valid Json String !" };

  /*Grid Message Constant*/
  public static get NoRecordFound(): string { return "No Record Found" };

  /*Role Heads Message Constant*/
  public static get PlantHeads(): string { return "Add User" };
  public static get LineHeads(): string { return "Add User" };
  public static get DeviceHeads(): string { return "Add User" };  
}
