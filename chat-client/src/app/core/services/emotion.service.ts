import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {AbstractService} from "../../shared/services/abstract.service";
import {SERVICES} from "../../../environments/environment";
import {EmotionGroup} from "../../shared/models/chat-client/emotion-group";
import {EmotionModel} from "../../shared/models/chat-client/emotionModel";
import {ToastService} from "../../shared/services/toast-service";
import {ResponseEnvelope} from "../../shared/models/chat-client/ResponseEnvelope";

@Injectable({providedIn: 'root'})
export class EmotionService extends AbstractService {
    get SERVICE_URL(): string {
        return `${SERVICES.CHAT_SERVICE_API.url}/public/api/v1`;
    }

    categories: EmotionGroup[];
    stickerMapByGroupName: Map<string, EmotionModel[]>

    listGifs: EmotionModel[];

    constructor(private http: HttpClient, private toastSv: ToastService, private translate: TranslateService) {
        super(http, toastSv, translate);
        this.categories = []
        this.stickerMapByGroupName = new Map<string, EmotionModel[]>()
        this.listGifs = []
    }

    public getThumbNailsAndFirstGroup(realmName: string, type: string): Observable<ResponseEnvelope<any>> {
        let param = new HttpParams();
        param = this.buildHttpParams(param, "type", type)
        param = this.buildHttpParams(param, "realmName", realmName)
        return this.getRequest(this.SERVICE_URL + '/emotions', {params: param})
    }

    isStickerLoaded(){
        return this.categories && this.categories.length > 0
    }

    loadStickerByGroupIdAndType(category: string, realmName: string, type: string): Observable<ResponseEnvelope<any>> {
        let param = new HttpParams();
        param = this.buildHttpParams(param, "type", type)
        param = this.buildHttpParams(param, "realmName", realmName)
        return this.getRequest(`${this.SERVICE_URL}/emotions/${category}`, {params: param})
    }

    loadGifsBySize(realmName: string, size: number, type: string): Observable<ResponseEnvelope<any>>{
        let params = new HttpParams()
        params = this.buildHttpParams(params, "type", type)
        params = this.buildHttpParams(params, "currentSize", size)
        params = this.buildHttpParams(params, "realmName", realmName)
        return this.getRequest(`${this.SERVICE_URL}/gifs`, {params: params})
    }

    isGifLoaded() {
        return this.listGifs && this.listGifs.length > 0;
    }
}