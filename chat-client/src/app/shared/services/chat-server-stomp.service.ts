import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {StompService} from "./stomp.service";
import {MessagingService} from "./messaging.service";
import {SeenMessageInService} from "./seen-message-in.service";
import {SERVICES} from "../../../environments/environment";

@Injectable()
export class ChatServerStompService implements OnDestroy {
    private _checkConnection$ = new Subject<boolean>();
    public scrolltoBottom$ = new Subject<boolean>();

    constructor(private chatStompService: StompService, private messageService: MessagingService, private seenMessageService: SeenMessageInService) {

    }

    ngOnDestroy() {
        if (this.isChatServerConnected()) {
            this.chatStompService.ngOnDestroy()
        }
    }

    get checkConnection$() {
        return this._checkConnection$.asObservable();
    }

    public connectToChatServer(token: string, userId: string, realmName: string, doConnect: boolean): void {
        this.chatStompService.configure({
            host: SERVICES.CHAT_SERVER_API.url + '/websocketChatServer',
            queue: {'connected': false, 'logged': false},
            headers: {
                'userId': userId,
                'userType': 1,
                'token': token,
                'clientUUID': "abc",
                'realmId': 1
            }
        });

        this.chatStompService.onError = (error: string) => {
            console.error(error);
            this._checkConnection$.next(false);
            console.log('Cannot connect to chat server');
            this.chatStompService.status = 'DISCONNECTED'
        };

        this.chatStompService.startConnect().then(() => {
            console.log('Chat server connected');
            this._checkConnection$.next(true);
            this.chatStompService.done('connected');

            /* Register to message subscription */
            try {
                this.chatStompService.subscribe('/topic/customer_chat_receive', (data: any) => {
                    // this.messageService.publish({'topic': data.objectId, 'data': data});
                    this.messageService.publish(data);
                })
            } catch (error) {
                this.changeConnectionDisconnected();
            }

            /* register for seen topic subscription */
            try {
                this.chatStompService.subscribe("/topic/customer_notification_" + realmName + '_' + userId, (data: any) => {
                    this.seenMessageService.publishMessage({'topic': data.objectId, 'data': data})
                })
            } catch (error) {
                this.changeConnectionDisconnected();
            }
        });
    }

    public isChatServerConnected() {
        return this.chatStompService.status === 'CONNECTED'
    }

    public changeConnectionDisconnected() {
        this._checkConnection$.next(false);
        this.chatStompService.status = 'DISCONNECTED'
    }
}
