import {Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {MessageIn} from "../models/chat-client/Message-in.model";

export interface Message {
    topic: string;
    data: any;
}

@Injectable()
export class SeenMessageInService{
    private seenMessageSub$: Subject<Message>

    public constructor(){
        this.seenMessageSub$ = new Subject()
    }

    public publishMessage(data: Message){
        this.seenMessageSub$.next(data)
    }

    public getSeenMessage(): Observable<Message>{
        return this.seenMessageSub$.asObservable();
    }

}