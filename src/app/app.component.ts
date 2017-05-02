import {Component} from '@angular/core';
import {FbServiceService} from "./fb-service.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'Hoo boy, this is going to suck....';
    amLoggedIn: boolean;
    connectStatusSubscription: Subscription;

    constructor(private _fbService: FbServiceService) {
        this.connectStatusSubscription = _fbService.sendConnectStatus$.subscribe(
            connectStatus => {
                this.amLoggedIn = connectStatus;
            }
        )
    }

    fbLogin(): void {
        this._fbService.fbLogin();
    }
}
