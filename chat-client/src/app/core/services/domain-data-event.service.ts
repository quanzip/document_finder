import {Subject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class DomainDataEventService {
    private configSubscription: Subject<boolean> = new Subject<boolean>()
    configSubscription$ = this.configSubscription.asObservable();

    public reloadUploadingConfigs(value: boolean){
        this.configSubscription.next(value)
    }
}