import {Component, OnInit} from '@angular/core';
import {FbServiceService} from "../fb-service.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
    myPages: any[];
    pageSubscription: Subscription;

    constructor(private _fbService: FbServiceService) {
        this.pageSubscription = _fbService.sendPages$.subscribe(
            pages => {
                this.myPages = pages;
            }
        )
    }

    ngOnInit() {
        this._fbService.getProfile();
    }

    pageClick(id: string, name: string, accessToken: string): void {
        this._fbService.getPosts(id, name, accessToken);
    }

}
