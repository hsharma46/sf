import { PlantModel } from "./plantModel";

export class LineModel {
    constructor() {
        this.Plant = new PlantModel();
    }

    public Id: string;
    public Name: string;
    public Description: string; 
    public PlantId: string="";
    public Plant: PlantModel;
    public IsActive: boolean=true;
    public ModifiedBy: string;
    public LastModified: string;
    public CreatedDateTime: string;
}