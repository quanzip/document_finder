import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {SERVICES} from '../../../../environments/environment';
import {ToastService} from "../toast-service";
import {AbstractService} from "../abstract.service";
import {TranslateService} from "@ngx-translate/core";

@Injectable({providedIn: 'root'})
export class ChatDomainService extends AbstractService {
    constructor(private http: HttpClient, private toastSvc: ToastService, private trans: TranslateService) {
        super(http, toastSvc, trans);
    }

    public token(data: any) {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let option = {
            headers,
            responseType: 'text'
        }
        return this.postRequestWithOption(this.SERVICE_URL + '/public/api/v1/chat-client/token', option, data)
    }

    public getDomain(domainCode: string): Observable<any> {
        return this.getRequest(this.SERVICE_URL + '/public/api/v1/chat-client/domains/' + domainCode)
    }

    public getDomainDataAndCalendarAndMessageDefaultAndDomainDetail(domainCode: string, serviceId: string): Observable<any> {
        return this.getRequest(this.SERVICE_URL + '/public/api/v1/chat-client/domains' +
            '?domainCode=' + domainCode + '&serviceId=' + serviceId)
    }

    public getServieIdByDomaincode(domainCode: string): Observable<any> {
        return this.getRequest(this.SERVICE_URL + '/public/api/v1/chat-client/services/' + domainCode)
    }

    public getMessageDefault(domainId: string, type: number) {
        return this.getRequest(this.SERVICE_URL + '/public/api/v1/chat-client/message-default?domainId=' + domainId + '&type=' + type)
    }

    public getDomainDetail(domainId: string, type: number) {
        return this.getRequest(this.SERVICE_URL + '/public/api/v1/chat-client/domain-details?domainId=' + domainId + '&type=' + type)

    }

    get SERVICE_URL(): string {
        return SERVICES.CHAT_SERVICE_API.url;
    }
}
