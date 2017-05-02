import {Injectable} from '@angular/core';
import {FacebookInitParams, FacebookLoginOptions, FacebookLoginResponse, FacebookService} from "ng2-facebook-sdk";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable()
export class FbServiceService {
    private amLoggedIn: boolean;
    private myPages: any[];
    private officeVideos: Array<any>;

    currentName: string;
    currentPageID: string;
    currentToken: string;

    constructor(private fb: FacebookService, private _router: Router) {
        let fbParams: FacebookInitParams = {
            appId: "186809285132973",
            xfbml: true,
            version: "v2.8"
        };
        this.fb.init(fbParams);
    }

    sendConnectStatus = new Subject<any>();
    sendConnectStatus$ = this.sendConnectStatus.asObservable();

    sendPages = new Subject<any>();
    sendPages$ = this.sendPages.asObservable();

    sendVideos = new Subject<any>();
    sendVideos$ = this.sendVideos.asObservable();

    fbLogin(): void {
        // here are some log in options. more may need to be added for permssions
        const loginOptions: FacebookLoginOptions = {
            enable_profile_selector: true,
            return_scopes: true,
            scope: "public_profile, pages_show_list, manage_pages, publish_pages"
        };
        // here is login time, probably more using for an ngIf
        this.fb.login(loginOptions).then(
            (response: FacebookLoginResponse) => {
                if (response.status == "connected") {
                    this.amLoggedIn = true;
                    this.getProfile();
                    this._router.navigate(["/pages"]);
                }
                else {
                    this.amLoggedIn = false;
                }
                this.sendConnectStatus.next(this.amLoggedIn);
            },
            (error: any) => console.log("I'm this error:", error)
        );
    }

    getProfile() {
        this.fb.api("/me/accounts?limit=1000")
            .then((res: any) => {
                this.myPages = res.data;
                this.sendPages.next(this.myPages);
            })
            .catch(() => console.log("Ooops"))
    }

    getPosts(id: string, name: string, accessToken: string): void {
        this.currentName = name;
        this.currentPageID = id;
        this.currentToken = accessToken;
        this.officeVideos = [];
        this.fb.api(id + "/posts?limit=100")
            .then((res: any) => {
                let postArray = res.data;
                postArray.forEach((post) => {
                    this.fb.api(`${post.id}`, "get", {
                        fields: "type, admin_creator, object_id",
                        access_token: accessToken
                    }).then((response) => {
                        if (response.type == "video") {
                            if (response.admin_creator) {
                                if (response.admin_creator.name == "Patient Snap" && response.type == "video") {
                                    this.getVideos(response.object_id);
                                }
                            }
                            else {
                                this.getVideos(response.object_id);
                            }
                        }
                    })
                })
            });
    }

    getVideos(videoID: string) {
        this.fb.api(`/${videoID}`, "get", {
            fields: "created_time, description, permalink_url, thumbnails",
        }).then((response) => {
            this.officeVideos.push(response);
            this.officeVideos.sort(function (a, b) {
                return (a.created_time > b.created_time) ? 1 : ((b.created_time > a.created_time) ? -1 : 0);
            });
            this.sendVideos.next(this.officeVideos);
        })
    }
}
