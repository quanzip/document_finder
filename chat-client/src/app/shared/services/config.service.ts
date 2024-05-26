import {Injectable, isDevMode} from "@angular/core";
import {AbstractService} from "./abstract.service";
import {HttpClient} from "@angular/common/http";
import {ToastService} from "./toast-service";
import {Observable} from "rxjs/Rx";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class ConfigService extends AbstractService {

    private _domainConfig: any = null;

    constructor(private http: HttpClient, private toastSvc: ToastService, private translateSvc: TranslateService) {
        super(http, toastSvc, translateSvc);
    }

    public load(): Promise<any> {
        return new Promise((resolve, reject) => {
            new Observable((observer) => {
                this._domainConfig = {
                    domainId: 1,
                    domainCode: 'b27d4da6-1f79-43aa-978a-a4008636d3af',
                    realm: 'demo',
                    realmId: '1'
                };
                isDevMode() && console.log("domain config loaded", this._domainConfig);
                resolve(true);
            }).subscribe();
        });
    }

    get domainId() {
        return this._domainConfig.domainId;
    }

    get realm() {
        return this._domainConfig.realm;
    }

    get realmId() {
        return this._domainConfig.realmId;
    }

    get domainConfig() {
        return this._domainConfig;
    }

    get SERVICE_URL(): string {
        return `users`;
    }
}
