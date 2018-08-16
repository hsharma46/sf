/*In-Builts*/
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent {
  @Input() errorMsg: string;
  @Input() displayError: boolean;
}