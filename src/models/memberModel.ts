import { UserModel } from "./userModel";
import { PlantModel } from "./plantModel";
import { LineModel } from "./lineModel";
import { DeviceModel } from "./deviceModel";

export class MemberModel {

  constructor() {
    this.Line = new LineModel();
    this.Plant = new PlantModel();
    this.User = new UserModel();
    this.Device = new DeviceModel();
  }

  public Id: string;
  public DeviceCode: string;
  public Device: DeviceModel;
  public Line: LineModel;
  public Plant: PlantModel;
  public User: UserModel;
  public IsActive: boolean;
  public isDeleted: boolean;
  public isNew: boolean;
  public LinePlantId: string;
}
