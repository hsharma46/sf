/*In-Builts*/
import { Injectable, Inject } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

/*Services*/
import { UserInfoService } from './userInfo.service';
import { MenuService } from '../components/menu/service/menu.service';

@Injectable()

export class CustomHttpInterceptor implements HttpInterceptor {
    constructor(private _userInfoService: UserInfoService,
        private _router: Router,
        private _menu: MenuService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
        if (req.headers.get('No-Auth') == "True")
            return next.handle(req.clone());

        // Clone the request to add the new header.
        if (!!this._userInfoService.getUserToken()) {
            const authReq = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + this._userInfoService.getUserToken())
            });

            //send the newly created request
          return next.handle(authReq)
            .pipe(tap(
                    (event: HttpEvent<any>) => {
                        if (event instanceof HttpResponse) {
                            if (event.status === 403) {
                                this._menu.hideMenuItem();
                                this._router.navigate(['statuscode', event.status, 'You are not authorised !']);
                            }
                            else if (event.status === 404) {
                                this._menu.hideMenuItem();
                                this._router.navigate(['statuscode', event.status, 'Not Found !']);
                            }
                            else {
                                this._menu.showMenuItem();
                            }
                        }
                    },
              err => {
                        if (err.status === 500) {
                            this._router.navigate(['statuscode', err.status, err.statusText]);
                        }
                        else if (err.status === 403) {
                            this._menu.hideMenuItem();
                            this._router.navigate(['statuscode', err.status, 'You are not authorised !']);
                        }
                        else {
                            this._menu.hide();
                            this._router.navigate(['login']);
                        }

              }
                    )
                );
        }
    }
}

