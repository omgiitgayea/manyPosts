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
        )
    }

    ngOnInit() {
        this.pageName = this._fbService.currentName;
    }

    testPdf(): void {
        let doc = new jsPDF();
        let position = 0;
        doc.setFontSize(20);
        doc.text(20, 20, this.pageName);
        doc.setFontSize(10);
        for(let i = 0; i < this.pageVideos.length; i++) {
            doc.text(this.pageVideos[i].thumbnails.data[0].uri, 20, 30 + this.LINK_SPACING * position);
            position++;
            doc.text(`https://www.facebook.com${this.pageVideos[i].permalink_url}`, 20, 30 + this.LINK_SPACING * position);
            position++;
        }

        // Save the PDF
        doc.save(`${this.pageName}.pdf`);
    }
}
