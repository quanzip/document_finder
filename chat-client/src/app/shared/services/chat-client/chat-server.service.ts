import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ToastService} from "../toast-service";
import {Injectable} from "@angular/core";
import {AbstractService} from "../abstract.service";
import {SERVICES} from "../../../../environments/environment";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {ResponseEnvelope} from "../../models/chat-client/ResponseEnvelope";

@Injectable({providedIn: 'root'})
export class ChatServerService extends AbstractService {
    constructor(private http: HttpClient, private toastSvc: ToastService, private trans: TranslateService) {
        super(http, toastSvc, trans);
    }

    public registerUser(data: any, realmName: string) {
        return this.postRequest(this.PUBLIC_SERVICE_URL + '/users?realmName=' + realmName, data)
    }

    public sendMessage(data: any) {
        return this.postRequest(this.BASIC_SERVICE_URL + '/chat', data)
    }

    public sendNotFoundSolutionQuestion(data: any) {
        return this.postRequest(this.BASIC_SERVICE_URL + '/chat/user-confirm-not-accept', data)
    }

    get SERVICE_URL(): string {
        return SERVICES.CHAT_SERVER_API.url + '/api/v1';
    }

    get PUBLIC_SERVICE_URL(): string {
        return SERVICES.CHAT_SERVER_API.url + '/public/api/v1';
    }

    get BASIC_SERVICE_URL(): string {
        return SERVICES.CHAT_SERVER_API.url + '/basic/api/v1';
    }

    sendTyping(data: any, realmName: string, userId: string) {
        return this.postRequest(this.BASIC_SERVICE_URL + '/chat/' + userId + '/typing', data)
    }

    sendSeen(data: any, realmName: string, userId: string) {
        return this.postRequest(this.BASIC_SERVICE_URL + '/chat/' + userId + '/seen', data)
    }

    getSeen(realmName: string, conversationId: string) {
        return this.getRequest(this.BASIC_SERVICE_URL + "/conversations/" + conversationId + "/participants")
    }

    public getChatHistory(conversationId: string, start: number, length: number): Observable<ResponseEnvelope<any>> {
        return this.getRequest(`${this.BASIC_SERVICE_URL}/chat/chat-history/${conversationId}/${start}/${length}`)
    }

    public getSuggest(input: string, siteCode: string): Observable<any> {
        let param = new HttpParams();
        param = this.buildHttpParams(param, "input", input);
        param = this.buildHttpParams(param, "siteCode", siteCode);
        return this.getRequest(`${this.SERVICE_URL}/suggest`, {params: param})
    }

    public getUserConversation() {
        return this.getRequest(this.BASIC_SERVICE_URL + "/conversations/conversation-ids")
    }
}
