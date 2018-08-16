/*In-Builts*/
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

/*Constants & Enums*/
import { AppConstant } from '../../constants/app.constants';
import { IconConstant } from '../../constants/icon.constant';

/*Models*/
import { MemberModel } from '../../models/MemberModel';
import { UserModel } from '../../models/userModel';

/*Services*/
import { MemberService } from './service/member.service'
import { UserService } from '../user/service/user.service';


@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent {

  /* Property Creation */
  public addMemberList: MemberModel[] = [];
  public isLoading: boolean = true;
  public isModalVisible: boolean;
  public MemberList: MemberModel[] = [];
  public noRecordFound: boolean = false;
  public noRecordFoundText: string = '';
  public pageIcon: string = '';
  public spinnerClass: string = '';
  public userList: MemberModel[] = [];

  /*Input Property*/
  @Input() Id: string;
  @Input() MemberHeaderText: string;
  @Input() MemberType: string;


  constructor(private _MemberService: MemberService, private _userService: UserService) {
    if (!!this.Id) {
      this.intializeMember();
    }
    this.pageIcon = IconConstant.members;
    this.spinnerClass = IconConstant.spinnerClass;
    this.noRecordFoundText = AppConstant.NoRecordFound;
  }

  onCheckBoxChange(member: MemberModel, event: any) {

    if (event.target["checked"]) {
      member.isNew = true;
      member.isDeleted = false;
    }
    else {
      member.isNew = false;
      member.isDeleted = true;
    }

    var currentIndex = this.isMemberExist(member, this.addMemberList);


    if (currentIndex > -1) {
      if (this.isMemberExist(member, this.MemberList) > -1) {
        this.addMemberList[currentIndex] = member;
      }
      else {
        this.addMemberList.slice(this.isMemberExist(member, this.MemberList), 1);
      }
    }
    else {
      this.addMemberList.push(member)
    }
  }

  removeMember(member: MemberModel) {    
    let members: MemberModel[] = [];
    let currentIndex = this.isMemberExist(member, this.MemberList);
    this.MemberList.slice(currentIndex, 1);
    member.isDeleted = true;
    member.isNew = false;
    members.push(member);

    this._MemberService.saveMember(members, this.MemberType).subscribe(data => {
      this.intializeMember();
    },
      error => {
        return Observable.throw(error);
      });
  }

  AddMember(member: MemberModel[]) {
    this._MemberService.saveMember(member, this.MemberType).subscribe(data => {
      this.intializeMember();
    },
      error => {
        return Observable.throw(error);
      });
  }

  submitMember() {
    this.AddMember(this.addMemberList);
    this.closeModal();
  }

  closeMember() {
    this.addMemberList = [];
    this.addMemberList = Object.assign([], this.MemberList);
    this.closeModal();
  }

  openModal() {
    this.isModalVisible = true;
    this.userList = [];
    this.addMemberList = [];
    this.addMemberList = Object.assign([], this.MemberList);
  }

  searchMember(text: string) {
    var member: MemberModel;
    this.userList = [];
    if (text.length > 2) {
      this._MemberService.searchMembers(text, this.MemberType).subscribe((data: UserModel[]) => {
        for (let iRowCount = 0; iRowCount < data.length; iRowCount++) {
          member = new MemberModel();
          member.Id = data[iRowCount].Id;
          member.IsActive = data[iRowCount].IsActive;
          member.User = data[iRowCount];
          if (this.MemberType === AppConstant.Device) {
            member.DeviceCode = this.Id;
          }
          else {
            member.LinePlantId = this.Id;
          }
          this.userList.push(member);
        }
      },
        error => {
          this.closeModal();
        });
    }
  }

  isChecked(member: MemberModel): boolean {
    return this.MemberList.findIndex(x => x.Id == member.Id) > -1 ? true : false;
  }

  intializeMember() {
    
    this._MemberService.getMemberById(this.Id, this.MemberType).subscribe((data: MemberModel[]) => {
      this.MemberList = [];
      for (var i = 0; i < data.length; i++) {
        this.MemberList.push(data[i]);
      }
      this.noRecordFound = data.length > 0 ? false : true;
      this.isLoading = false;
    });
  }

  /*private Member*/
  private isMemberExist(member: MemberModel, members: MemberModel[]): number {
    if (!!!members) {
      return -1;
    }
    else {
      return members.findIndex(x => x.Id == member.Id)
    }
  }

  private closeModal() {
    this.isModalVisible = false;
  }
}
