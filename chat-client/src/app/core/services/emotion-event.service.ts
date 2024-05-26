import {BehaviorSubject, Subject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class EmotionEventService {
    private stickerEvent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    stickerEvent$ = this.stickerEvent.asObservable();

    private gifEvent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    gifEvent$ = this.gifEvent.asObservable();

    public reloadStickerList(value: boolean){
        this.stickerEvent.next(value);
    }

    reloadGifList(value: boolean) {
        this.gifEvent.next(value);
    }
}