import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {AbstractService} from "../../shared/services/abstract.service";
import {SERVICES} from "../../../environments/environment";
import {ToastService} from "../../shared/services/toast-service";

@Injectable({providedIn: 'root'})
export class SurveyService extends AbstractService{
    constructor(private http: HttpClient, private toastSv: ToastService, private translate: TranslateService) {
        super(http, toastSv, translate);
    }

    get SERVICE_URL(): string {
        return SERVICES.TICKET_SERVICE_API.url;
    }

    openSurveyPage(realmName: string, surveyClientId: string) {
        let param = new HttpParams();
        param = this.buildHttpParams(param, "realmName", realmName);
        param = this.buildHttpParams(param, "clientId", surveyClientId);
        return this.getRequest(this.SERVICE_URL + "/public/api/v1/survey-client/verify-open-survey", {params: param});
    }
}