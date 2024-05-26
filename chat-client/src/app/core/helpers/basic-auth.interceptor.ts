import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserProfileService} from "../services/user-data.service";
import {DomainDataService} from "../services/domain-data.service";

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

    private noUsingBasicAuth: string[] = ['domains', 'domain-details', 'message-default', 'token', 'files', 'emotions', 'gifs', 'survey-client']

    constructor(private userProfileService: UserProfileService, private domainDataService: DomainDataService) {
    }

    private checkUrl(url: string): boolean {
        for (let bypassUrl of this.noUsingBasicAuth) {
            let byPass = url.indexOf(bypassUrl)
            if (byPass >= 0) return true;
        }
        return false;

    }

    /* intercept to header when call api */
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = req.url.toLowerCase();
        const userId = this.userProfileService.userId;
        const sessionToken = this.userProfileService.sessionToken;

        if (this.checkUrl(url)) {
            let headers = req.headers
                .set('x-ipcc2-realm', this.domainDataService.realmName)
            return next.handle(req.clone({headers}));
        }

        let headers = req.headers
            .set('x-ipcc2-realm', this.domainDataService.realmName)
            .set('Content-Type', 'application/json')
        if (userId && sessionToken) {
            headers = headers.set('Authorization', 'Basic ' + btoa(`${userId}:${sessionToken}`));
        }

        return next.handle(req.clone({headers}));
    }
}
