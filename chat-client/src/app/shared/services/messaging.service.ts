import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs/Rx";
import {MessageIn} from "../models/chat-client/Message-in.model";

export interface Message {
    topic: string;
    data: MessageIn;
}

@Injectable()
export class MessagingService {
    private message$: Subject<Message>

    constructor() {
        this.message$ = new Subject<Message>();
    }

    public publish(message: Message): void {
        this.message$.next(message);
    }

    public getMessage(): Observable<any> {
        return this.message$;
    }

    public of(topic: any): Observable<any> {
        return this.message$.filter(m => m.topic == topic).map(m => m.data);
    }
}