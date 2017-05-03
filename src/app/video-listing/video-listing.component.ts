import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FbServiceService} from "../fb-service.service";
import * as jsPDF from "jspdf";

@Component({
    selector: 'app-video-listing',
    templateUrl: './video-listing.component.html',
    styleUrls: ['./video-listing.component.css']
})
export class VideoListingComponent implements OnInit {
    pageName: string;
    pageVideos: any[] = [];
    LINK_SPACING = 5;
    videoPageSubscription: Subscription;

    constructor(private _fbService: FbServiceService) {
        this.videoPageSubscription = _fbService.sendVideos$.subscribe(
            data => {
                this.pageVideos = data;
            }
        );
    }

    ngOnInit() {
        this.pageName = this._fbService.currentName;
    }

    testPdf(): void {
        let doc = new jsPDF();
        this.toDataURL(this.pageVideos[0].thumbnails.data[0].uri, (dataURL) => {
            doc.addImage(dataURL, 20, 70, 160, 90);
            doc.save(`${this.pageName}.pdf`);
        }, 'image/jpeg');
        // let position = 0;
        // doc.setFontSize(20);
        // doc.text(20, 20, this.pageName);
        // doc.setFontSize(10);
        // for (let i = 0; i < this.pageVideos.length; i++) {
        //     doc.text(this.pageVideos[i].thumbnails.data[0].uri, 20, 30 + this.LINK_SPACING * position);
        //     position++;
        //     doc.text(`https://www.facebook.com${this.pageVideos[i].permalink_url}`, 20, 30 + this.LINK_SPACING * position);
        //     position++;
        // }

        // Save the PDF
        // doc.save(`${this.pageName}.pdf`);
    }

    toDataURL(src, callback, outputFormat) {
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
        };
        img.src = src;
        if (img.complete || img.complete === undefined) {
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
            img.src = src;
        }
    }
}
