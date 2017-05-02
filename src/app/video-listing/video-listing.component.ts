import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FbServiceService} from "../fb-service.service";

@Component({
    selector: 'app-video-listing',
    templateUrl: './video-listing.component.html',
    styleUrls: ['./video-listing.component.css']
})
export class VideoListingComponent implements OnInit {
    pageName: string;
    pageVideos: any[] = [];

    videoPageSubscription: Subscription;

    constructor(private _fbService: FbServiceService) {
        this.videoPageSubscription = _fbService.sendVideos$.subscribe(
            data => {
                this.pageVideos = data;
            }
        )
    }

    ngOnInit() {
        this.pageName = this._fbService.currentName;
    }


}
