import { RolesModel } from './RolesModel'
import { CompanyModel } from './companyModel'
import { RoleWiseUserModuleModel } from './roleWiseNavigationModel';

export class UserModel {
  constructor() {
    this.Company = new CompanyModel();
  }

  public Id: string = "";
  public FirstName: string = "";
  public LastName: string = "";
  public FullName: string = "";
  public UserName: string = "";
  public Email: string = "";
  public IsActive: boolean = true;
  public Roles: RolesModel[] = [];  
  public RoleNames: string = "";
  public RoleWiseUserModule: RoleWiseUserModuleModel[] = [];
  public Company: CompanyModel;
  public LastModified: string = "";
  public CreatedDateTime: string;
  public DefaultPage: string;
  public IsAlreadyExists: boolean;
  public ResultMessage: string = "";
}
