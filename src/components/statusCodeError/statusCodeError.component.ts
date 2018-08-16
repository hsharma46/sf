/*In-Builts*/
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-error',
    templateUrl: './statusCodeError.component.html'
})

export class StatusCodeErrorComponent implements OnInit {
    public statusCode: string = "";
    public statusText: string = "";

    constructor(private _activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.statusCode = this._activatedRoute.snapshot.params["code"];
        this.statusText = this._activatedRoute.snapshot.params["text"];
        if (!!!this.statusCode) {
            this.statusText = "Page Not Found !"
        }
    }
}