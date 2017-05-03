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
    MONTHS = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    pageName: string;
    pageVideos: any[] = [];
    LINK_SPACING = 10;
    VIDEO_HEIGHT = 101;
    VIDEO_WIDTH = 180;
    TOP_OFFSET = 15;
    LEFT_MARGIN = 15;
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
        let date = new Date();
        doc.setFontSize(20);
        doc.text(this.pageName, this.LEFT_MARGIN, this.TOP_OFFSET);
        doc.setFontSize(10);
        doc.text(`The following is your social media report for as of ${this.MONTHS[date.getMonth()]} ${date.getDate()}. Since you began with us, we have posted`, this.LEFT_MARGIN, this.TOP_OFFSET + this.LINK_SPACING);
        doc.text(`${this.pageVideos.length} videos to your Facebook page:`, this.LEFT_MARGIN, this.TOP_OFFSET + this.LINK_SPACING * 1.5);
        let startPos = this.pageVideos[0].permalink_url.indexOf('/vid');
        doc.setTextColor(0, 0, 255);
        doc.text(`https://www.facebook.com${this.pageVideos[0].permalink_url.slice(0, startPos)}`, this.LEFT_MARGIN, this.TOP_OFFSET + this.LINK_SPACING * 2);
        // console.log(this.pageVideos[0].permalink_url.slice(0, startPos));
        let counter = 0;
        let pages: number;
        if (this.pageVideos.length % 2 === 0) {
            pages = this.pageVideos.length / 2;
        }
        else {
            pages = Math.floor(this.pageVideos.length / 2) + 1;
        }
        for (let i = 0; i < pages; i++) {
            doc.addPage();
        }

        for (let i = 0; i < this.pageVideos.length; i++) {
            this.toDataURL(this.pageVideos[i].thumbnails.data[0].uri, (dataURL) => {
                let pageNo = Math.floor((i + 1) / 2) + 1;
                doc.setPage(pageNo);
                doc.addImage(dataURL, this.LEFT_MARGIN, this.TOP_OFFSET + (this.VIDEO_HEIGHT + this.LINK_SPACING * 2) * ((i + 1) % 2), this.VIDEO_WIDTH, this.VIDEO_HEIGHT);
                doc.text(`https://www.facebook.com${this.pageVideos[i].permalink_url}`, this.LEFT_MARGIN, this.TOP_OFFSET + (this.VIDEO_HEIGHT + this.LINK_SPACING * 2) * ((i + 1) % 2 + 1) - this.LINK_SPACING);
                counter++;
                if (counter === this.pageVideos.length) {
                    doc.setPage(pages + 1);
                    doc.setTextColor(0, 0, 0);
                    let endingTextVertPos = this.TOP_OFFSET + (this.VIDEO_HEIGHT + this.LINK_SPACING * 2) * ((this.pageVideos.length + 1) % 2);
                    doc.text("Please let us know if you have any questions. Thank you for your business!", this.LEFT_MARGIN, endingTextVertPos);
                    doc.text("Sincerely,", this.LEFT_MARGIN, endingTextVertPos + this.LINK_SPACING);
                    doc.text("Patient Snap Team", this.LEFT_MARGIN, endingTextVertPos + this.LINK_SPACING * 1.5);
                    doc.text("P.S. We work nationwide so please refer us to your friends and family. For each office that you recommend that", this.LEFT_MARGIN, endingTextVertPos + this.LINK_SPACING * 2.5);
                    doc.text("signs up, we will give you a $50 gift card for an office lunch!", this.LEFT_MARGIN, endingTextVertPos + this.LINK_SPACING * 3);
                    doc.save(`${this.pageName}.pdf`);
                }
            }, 'image/jpeg');
        }
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
