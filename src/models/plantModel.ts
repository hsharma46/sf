import { CompanyModel } from "./companyModel";

export class PlantModel {
    constructor() {
        this.Company = new CompanyModel();
    }

    public CreatedDateTime: string = "";
    public Description: string = "";
    public Id: string = "";
    public IsActive: boolean = false;
    public ModifiedBy: string = "";
    public Name: string = "";
    public CompanyId: string = "";
    public Company: CompanyModel;
}
