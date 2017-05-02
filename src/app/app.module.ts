import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {FacebookService} from "ng2-facebook-sdk";
import {FbServiceService} from "./fb-service.service";
import {RouterModule} from "@angular/router";
import { VideoListingComponent } from './video-listing/video-listing.component';
import { PagesComponent } from './pages/pages.component';

@NgModule({
    declarations: [
        AppComponent,
        VideoListingComponent,
        PagesComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot([
            {path: "pages", component: PagesComponent},
            {path: "page/:id", component: VideoListingComponent},
        ])
    ],
    providers: [
        FacebookService,
        FbServiceService,
        RouterModule
    ],
    bootstrap: [AppComponent],
    exports: [RouterModule]
})
export class AppModule {

}
