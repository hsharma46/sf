/*In-Builts*/
import { NgModule, enableProdMode } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UrlSerializer } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DxSliderModule } from 'devextreme-angular';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';

/*Components*/
import { AppRoutingModule, routingComponent, routingServices } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from '../components/menu/menu.component';
import { ValidationComponent } from '../components/validation/validation.component';

/*Services*/
//import { AppConfigService } from '../shared/appConfig.service'
import { AppSettingsService } from "../shared/appSetting.service";
import { CommonService } from '../shared/common.service';
import { CustomHttpInterceptor } from '../shared/customHttpInterceptor';
import { MenuService } from '../components/menu/service/menu.service';
import { ValidationService } from '../components/validation/service/validation.service';
import { LowerCaseUrlSerializer } from '../shared/urlSerializer.Service';

//enableProdMode();

@NgModule({
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }), FormsModule, AppRoutingModule, DxSliderModule, AngularFontAwesomeModule, AngularDateTimePickerModule],
  declarations: [AppComponent, routingComponent, MenuComponent, ValidationComponent],
  bootstrap: [AppComponent],
  providers: [routingServices, MenuService, ValidationService, CommonService, AppSettingsService,
    { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer }
  ]
})
export class AppModule { }
