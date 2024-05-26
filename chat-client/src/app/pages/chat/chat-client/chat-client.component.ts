import {AfterViewInit, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChatClientModel, FileObject, SendingMessage} from '../../../shared/models/chat-client/chat-client.model';
import {ChatDomainService} from '../../../shared/services/chat-client/chat.domain.service';
import {ChatServerStompService} from '../../../shared/services/chat-server-stomp.service';
import {MessagingService} from '../../../shared/services/messaging.service';
import {fromEvent, merge, Observable, Observer, Subscription} from 'rxjs';
import {v4 as uuidv4} from 'uuid';
import {ActivatedRoute, Router} from '@angular/router';
import {ChatClientStateModel} from "../../../shared/models/chat-client/chat-client-state.model";
import {ChatMessageModel} from "../../../shared/models/chat-client/chat-message.model";
import {ChatServerService} from "../../../shared/services/chat-client/chat-server.service";
import {MessageOut} from "../../../shared/models/chat-client/message-out.mode";
import {Subject} from "rxjs/Subject";
import {map} from "rxjs/operators";
import {UserProfileService} from "../../../core/services/user-data.service";
import {DomainDataService} from "../../../core/services/domain-data.service";
import {SeenMessageInService} from "../../../shared/services/seen-message-in.service";
import {TranslateService} from "@ngx-translate/core";
import {MessageFlag, MessageModel, MessageType} from "../../../shared/models/chat-client/messageModel";
import {FileService} from "../../../shared/services/chat-client/file.service";
import {ChannelUploadType} from "../../../core/constant/constant";
import {DomainDataEventService} from "../../../core/services/domain-data-event.service";
import {SurveyParamModel} from "../../../shared/models/chat-client/survey-param.model";
import {UserRegisterChatServerModel} from "../../../shared/models/client-request/user-register-chat-server.model";

@Component({
    selector: 'app-chat-client',
    templateUrl: './chat-client.component.html',
    styleUrls: ['./chat-client.component.scss']
})
export class ChatClientComponent implements OnInit, OnDestroy, AfterViewInit {
    chatModel: ChatClientModel = new ChatClientModel();

    protected chatDomainService: ChatDomainService;
    protected fileService: FileService;
    protected chatServerStompService: ChatServerStompService;
    protected messageService: MessagingService;
    private seenMessageService: SeenMessageInService;
    private receiveSeenMessageSub: Subscription | undefined;
    private chatServerInterval: any = undefined;
    protected route: ActivatedRoute;
    protected router: Router;
    private chatServerService: ChatServerService;
    private receiveMessageSub: Subscription | undefined;
    private chatServerConnectionSubscription: Subscription | undefined
    private networkSubscription: Subscription | undefined;
    private messageDefaultSubscription: Subscription | undefined;
    private domainDetailSubscription: Subscription | undefined;
    private ticketId = null;
    private openFromHeader = false;
    /* connectionInWait mean only connect to chat-server when client send first message to agent */
    private connectionInWait = false;
    private channelId = 5;
    private domainCode = '';
    private messageStatus = {
        FAILED: 0,
        SENT: 1,
        SEEN: 2,
        SENDING: 3
    }
    disconnectWatcherValue = false;

    static EMOJI_ONLY_TEXT_REGEX = /^[\p{Extended_Pictographic}\s]+$/u;

    public connectStatus = {
        SUCCESS: "success",
        FAILED: "failed",
        ERROR: "error"
    }

    private userType = {
        AGENT: 2,
        CLIENT: 1
    }

    private messageType = {
        TEXT: 1,
        IMAGE: 8,
        STICKER: 15,
        GIF: 17,
        AUDIO: 3,
        VIDEO: 4,
        TYPING: 16,
        WARNING_END: 21,
        END_CHAT: 22,
        SURVEY: 27,
        MISS: 28
    }

    private errorFileType = {
        INVALID_FORMAT: -2,
        INVALID_SIZE: -1
    }

    public WORKING_TYPE = {
        IN_TIME: 1,
        OUT_TIME: 2
    }

    public scrolltoBottom$ = new Subject<boolean>();
    public typingSignal = new Subject<boolean>();
    /* contain FILES of failed message mark by contentExtra*/
    public failedMessages: any[] = [];
    private topic = '/topic/customer_chat_receive' + this.domainDataService.realmId + '_' + this.userProfileService.userId;

    private userFirstMessageInWait: SendingMessage[] = [];

    public lastOffsetCon: number = 0;

    constructor(private modalService: NgbModal, private userProfileService: UserProfileService,
                public domainDataService: DomainDataService, injector: Injector,
                private translateService: TranslateService, private domainDataEventService: DomainDataEventService) {
        this.chatDomainService = injector.get(ChatDomainService);
        this.fileService = injector.get(FileService);
        this.chatServerStompService = injector.get(ChatServerStompService);
        this.seenMessageService = injector.get(SeenMessageInService)
        this.messageService = injector.get(MessagingService);
        this.route = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
        this.chatServerService = injector.get(ChatServerService)
    }

    ngAfterViewInit(): void {
        // let thiz = this;
        // window.document.addEventListener("visibilitychange", function () {
        //     let global = thiz;
        //     let state = window.document.visibilityState;
        //     if (state == 'visible') {
        //         let chatHistory = global.chatModel.chatState.chatHistory;
        //         if (chatHistory && chatHistory.length > 0 && !global.chatModel.endChat) {
        //             let lastMessage = chatHistory[chatHistory.length - 1];
        //             let messageId = lastMessage.messageId;
        //             if (messageId) {
        //                 global.sendSeenStatusToChatServer(messageId);
        //             }
        //         }
        //     }
        // });
    }

    ngOnInit(): void {
        localStorage.setItem('open-chat', 'true')

        // temp
        let clientId: any = '';
        if (localStorage.getItem("clientId" + this.domainDataService.domainId)) {
            clientId = localStorage.getItem("clientId" + this.domainDataService.domainId);
        } else {
            clientId = btoa(uuidv4().replace(/-/g, ""));
            localStorage.setItem("clientId" + this.domainDataService.domainId, clientId);
        }

        this.userProfileService.userId = clientId

        this.chatServerStompService.connectToChatServer(this.userProfileService.sessionToken, this.userProfileService.userId, this.domainDataService.realmName, true);
        // this.chatServerConnectionSubscription = this.chatServerStompService.checkConnection$.subscribe(result => {
        //     this.chatModel.chatServerConnection = result;
        //     this.chatModel.attempToConnectChatServer = false;
        //     if (result) {
        //         if (this.disconnectWatcherValue == true) {
        //             this.addInfo("", "chat.chat-server.re-connected", MessageType.SERVER)
        //             this.showErrorMessages()
        //         }
        //         this.connectionInWait = false;
        //         if (this.userFirstMessageInWait.length > 0) {
        //             console.log(this.userFirstMessageInWait.length + " messages in queue to wait for connection")
        //             for (let messageObject of this.userFirstMessageInWait) {
        //                 this.chatModel.chatMessage = messageObject;
        //                 this.onChangeBody(this.chatModel);
        //             }
        //             this.userFirstMessageInWait = []
        //         }
        //     } else {
        //         this.disconnectWatcherValue = true;
        //     }
        // })
        // this.checkChatServerConnection();
        this.networkSubscription = this.checkInternetStatus().subscribe(isOnline => {
            this.chatModel.isNetworkAvailable = isOnline
            // /* only connect to server suddenly lost connection during chat, (!this.connectionInWait mean it must there was connection request to chat-server before)*/
            // if (isOnline && !this.chatModel.chatServerConnection && !this.chatModel.attempToConnectChatServer) {
            //     console.log('Internet re-connected, chat-client reconnecting to chat-server...')
            //     this.connectChatServer(true);
            // }
            //
            // if (!isOnline) {
            //     console.error('Internet is not available')
            // }

        });
        //
        // this.typingSignal.subscribe(signal => {
        //     if (this.chatModel.isNetworkAvailable && this.chatModel.chatServerConnection) {
        //         let messageOut = new MessageOut('', this.channelId, this.chatModel.conversationId, 'CHAT-CLIENT', this.userProfileService.userId, this.messageType.TYPING, 'Typing signal',
        //             '', [], [], [0], '', '', this.domainDataService!.domainCode!, this.userProfileService.serviceId,
        //             '', this.messageStatus.SENDING, signal);
        //
        //         let messageOutData = {
        //             "data": messageOut
        //         }
        //         let typingObservable = this.chatServerService.sendTyping(messageOutData, this.domainDataService!.realmName!, this.userProfileService.userId)
        //         typingObservable.subscribe(typingResult => {
        //         }, error => {
        //             console.log("Send typing signal failed");
        //             console.log(error);
        //         })
        //     }
        // });
        //
        // this.receiveSeenMessageSub = this.seenMessageService.getSeenMessage().subscribe(seenResult => {
        //     console.log("Received seen status from server!!")
        //     this.handleSeenStatus(seenResult);
        // });
        //
        this.receiveMessageSub = this.messageService.getMessage().subscribe(msg => {
            let data = msg.data;
            console.log(data);
            let isFromAgent = data.authorId != this.userProfileService.userId;
            if (data.type == this.messageType.TYPING) {
                if (isFromAgent) this.chatModel.isTyping = data.typing;
            } else {
                let existMessage;
                if(isFromAgent) {
                    existMessage = this.getMessageFromLocalStorageByContentExtra(data.id)
                }else {
                    existMessage = this.getMessageFromLocalStorageByContentExtra(data.contentExtra);
                }
                if (!existMessage) {
                    /* message */
                    if (this.domainDataService.workingTimeType == this.WORKING_TYPE.OUT_TIME && isFromAgent) {
                        this.domainDataService.workingTimeType = this.WORKING_TYPE.IN_TIME
                        this.chatModel.showService = false;
                        this.messageDefaultSubscription = this.chatDomainService.getMessageDefault(this.domainDataService.domainId, 1).subscribe(result => {
                            if (result && result.data) {
                                console.log(result.data)
                                this.domainDataService.domainMessageDefault = result.data;
                            }
                        });

                        this.domainDetailSubscription = this.chatDomainService.getDomainDetail(this.domainDataService.domainId, 1).subscribe(result => {
                            if (result && result.data) {
                                console.log(result.data)
                                this.domainDataService.domainDetail = result.data;
                            }
                        });
                    }

                    let sendStatus = this.messageStatus.SENT;
                    let reliable = true;
                    let sendSeen = true;
                    if (data.type == this.messageType.END_CHAT) {
                        reliable = false;
                        sendStatus = this.messageStatus.SEEN
                        // this.disableReplyOldMessages(data.id);
                    } else if (data.type == this.messageType.WARNING_END) {
                        console.log("WARNING end chat!")
                        reliable = false;
                    }

                    /* Case end chat then client continue chatting */
                    if (data.conversationId != this.chatModel.conversationId) {
                        this.chatModel.conversationId = data.conversationId;
                    }
                    let agentName
                    if (data.authorName) {
                        agentName = data.authorName
                    } else {
                        agentName = 'SYSTEM'
                    }
                    let isReplyMessage = false;
                    let replyFilesName = '';
                    let replyMsg = '';
                    let replyFiles = '';
                    let replyType = this.messageType.TEXT;
                    let replyId = data.replyTo;
                    let replyUserType = this.userType.CLIENT;
                    let isReplyingAlbum = false;
                    if (replyId) {
                        let replyMessage = this.getMessageFromLocalStorageById(replyId);

                        isReplyMessage = true;
                        replyFilesName = replyMessage.filesName[0];
                        replyMsg = replyMessage.content;
                        replyFiles = this.fileService.getURLContentFilePublic(replyMessage.files[0], this.domainDataService.realmName);
                        replyType = replyMessage.type;
                        replyUserType = replyMessage.userType;
                        isReplyingAlbum = this.isReplyingAlbum(replyId);
                    }

                    let survey: SurveyParamModel = new SurveyParamModel();
                    let fileNames: string[] = [];
                    let fileSizes: number = 0
                    let files: string[] = []
                    let type = data.type;
                    let onlyEmoji = false;
                    if (type == this.messageType.TEXT) {
                        if (data.content.match(ChatClientComponent.EMOJI_ONLY_TEXT_REGEX)) {
                            onlyEmoji = true
                        }
                    } else if (type == this.messageType.SURVEY) {
                        /* SURVEY */
                        reliable = false;
                        sendStatus = this.messageStatus.SEEN
                        survey.clientId = data.surveyClientId
                        survey.realmName = this.domainDataService.realmName
                        // this.disableReplyOldMessages(data.id);
                    } else if (type == this.messageType.MISS) {
                        /* SURVEY */
                        reliable = false;
                        sendStatus = this.messageStatus.SEEN
                    } else {
                        fileNames = data.fileName
                        fileSizes = data.fileSize
                        files = data.fileUrl
                    }

                    let chatMessage = new ChatMessageModel(data.id, this.channelId, agentName, isFromAgent ? this.userType.AGENT : this.userType.CLIENT, data.authorId, 'ticket_id', onlyEmoji,
                        false, data.content, "", isFromAgent ? data.id : data.contentExtra, this.topic, [], files, fileNames, fileSizes, type, sendStatus, data.receivedAt,
                        reliable, isReplyMessage, replyId, replyMsg, replyFiles, replyFilesName, replyType, replyUserType, isReplyingAlbum, '');

                    if (survey) {
                        chatMessage.survey = survey;
                    }

                    this.chatModel.chatState.chatHistory.push(chatMessage);
                    this.saveChatStateToStorage();
                    this.gainFocusOnTextInput();
                    this.scrolltoBottom$.next(true)

                    /* send seen status using seen api */
                    if (this.chatModel.showChatBox && sendSeen && window.document.visibilityState == 'visible' && isFromAgent) {
                        console.log("Sending seen when receive message from agent...")
                        this.sendSeenStatusToChatServer(data.id)
                    }

                    /* check if chat is ended */
                    if (data.type == this.messageType.END_CHAT) {
                        this.chatModel.endChat = true;
                        this.endCurrentConversation()
                    }
                }
            }
        }, error => {
            console.log('Can not receive msg from Server, lost connection!!')
            console.log(error)
        });
        //
        // this.domainCode = this.route.snapshot.paramMap.get('domain') + '';
        // /*  Set CHAT session ready, start connecting to server*/
        // this.chatModel.endChat = localStorage.getItem("endChat_" + this.domainDataService.domainCode) == 'true';
        //
        // this.chatModel.showService = this.domainDataService.showService
        // if (!this.showService()) {
        //     /* get history of chat in local */
        //     // @ts-ignore
        //     // this.chatModel.chatState = JSON.parse(localStorage.getItem('chatState_' + this.domainDataService.domainId));
        //     // if (this.domainDataService.domainMessageDefault.content && this.domainDataService.domainMessageDefault.content != ''
        //     //     && !this.openFromHeader && this.chatModel.chatState.chatHistory.length == 0) {
        //     //     this.senMessageWithRoleAgent(this.domainDataService.domainMessageDefault.content)
        //     // }
        //
        //     /* Create connect to server only if chat-history not null &&  length >=1 and that first message id is not greeting message from agent (id = 0) */
        //     // if (this.chatModel.chatState != null && (this.chatModel.chatState.chatHistory && this.chatModel.chatState.chatHistory.length > 1 || (this.chatModel.chatState.chatHistory[0] && this.chatModel.chatState.chatHistory[0].messageId))) {
        //     //     this.chatModel.chatState.chatHistory = this.chatModel.chatState.chatHistory
        //     //         .filter(chat => (chat.type == this.messageType.TEXT || (chat.type != this.messageType.TEXT && chat.status != this.messageStatus.FAILED)))
        //     if (!this.chatModel.chatServerConnection && !this.chatModel.attempToConnectChatServer) {
        //         this.connectChatServer(true)
        //     } else {
        //         // this.restoreChatFromLocal();
        //         // this.loadHistoryDataChat();
        //     }
        //     // } else {
        //     //     console.log("Lazy init user...")
        //     //     this.connectionInWait = true;
        //     //     this.restoreChatFromLocal()
        //     // }
        // }
    }

    endCurrentConversation() {
        /*  Set CHAT session ready, start connecting to server*/
        this.chatModel.endChat = true;
        localStorage.setItem("endChat_" + this.domainDataService.domainCode, this.chatModel.endChat + '')
    }

    ngOnDestroy() {
        // if (this.chatModel.chatServerConnection) {
        //     this.chatServerStompService.ngOnDestroy()
        // }
        // this.chatServerConnectionSubscription?.unsubscribe();
        // this.receiveMessageSub?.unsubscribe();
        // this.typingSignal?.unsubscribe()
        // this.receiveSeenMessageSub?.unsubscribe()
        // this.networkSubscription?.unsubscribe()
        // this.messageDefaultSubscription?.unsubscribe();
        // this.domainDetailSubscription?.unsubscribe();
        // if (this.chatServerInterval) {
        //     window.clearInterval(this.chatServerInterval);
        // }
    }

    isReplyingAlbum(messageId: string): boolean {
        let message: ChatMessageModel | undefined = this.chatModel.chatState.chatHistory.find(chatMessage => chatMessage.messageId == messageId);
        if (message && message.filesName.length > 1) {
            return true;
        }
        return false;
    }

    disableReplyOldMessages(id: string) {
        for (let oldMess of this.chatModel.chatState.chatHistory) {
            console.log(oldMess.content)
            oldMess.isRepliable = false;
            if(oldMess.messageId == id) {
                this.saveChatStateToStorage();
                return;
            }
        }
        this.saveChatStateToStorage();
    }

    checkChatServerConnection() {
        this.chatServerInterval = window.setInterval(() => {
            console.log('Connect status: chat-client ' + this.chatModel.chatServerConnection)
            /* only connect to server suddenly lost connection during chat, (!this.connectionInWait mean it must there was connection request to chat-server before)*/
            if (!this.chatModel.chatServerConnection && this.chatModel.isNetworkAvailable && !this.connectionInWait && !this.chatModel.attempToConnectChatServer) {
                console.log('Lost connection to chat-server due to silence for long, reconnecting every 1s until reconnected...')
                this.connectChatServer(true);
            }
        }, 2000)
    }

    checkInternetStatus() {
        return merge<boolean>(
            fromEvent(window, 'offline').pipe(map(() => false)),
            fromEvent(window, 'online').pipe(map(() => true)),
            new Observable((sub: Observer<boolean>) => {
                sub.next(navigator.onLine);
                sub.complete();
            }));
    }

    getMessageFromLocalStorageById(id: string): ChatMessageModel {
        return this.chatModel.chatState.chatHistory.find(i => i.messageId === id)!;
    }

    getMessageFromLocalStorageByContentExtra(contentExtra: string): ChatMessageModel {
        let length = this.chatModel.chatState.chatHistory.length;
        for (let index = length - 1; index >= 0; index--) {
            let msg = this.chatModel.chatState.chatHistory[index];
            if (msg.contentExtra === contentExtra) return msg;
        }
        return this.chatModel.chatState.chatHistory[length];
    }

    getRandomArbitrary(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**v
     * Open modal
     * @param content content
     */
    open(content: any) {
        this.modalService.open(content, {size: 'lg', centered: true});
    }

    openChatBox() {
        parent.postMessage('openChatBox', '*');
        this.chatModel.showChatBox = true;
    }

    showChatBox(): boolean {
        return this.chatModel.showChatBox;
    }

    showService(): boolean {
        // return this.chatModel.showService && (this.domainDataService.services.length > 1 || this.domainDataService.enableCustomerInfo == 1)
        return false;
    }

    onChangeHeader(event: ChatClientModel) {
        this.chatModel = event;
        this.openFromHeader = true;
        if (!this.showChatBox()) {
            this.domainDataService.autoChat = 0
            let externalId = (this.userProfileService.externalId != null && this.userProfileService.externalId != '') ? this.userProfileService.externalId.trim() : null;
            let userCode = externalId == null ? null : ((this.userProfileService.userCode != null && this.userProfileService.userCode != '') ? this.userProfileService.userCode.trim() : null);
            let path = '/chat-client/close/' + this.domainDataService.domainCode
                + '?realm=' + this.domainDataService.realmName;
            if (externalId) {
                path = path + '&externalId=' + externalId
            }
            if (userCode) {
                path = path + '&userCode=' + userCode
            }
            this.router.navigate([path])
            parent.postMessage('closeChatBox', '*');
        }
    }

    getTimeNowInLong() {
        return new Date().getTime();
    }

    /* first time self-user open chat and send first message */
    onChangeService(event: ChatClientModel) {
        this.saveCustomerInfoToStorage();
        this.sendGreetMessageDefault();


        /* only connect to server when allow info, first msg and open from component [close chat]. not from chat-header component*/
        if (this.userProfileService.message != '' && !this.openFromHeader) {
            console.log("Push to queue from onChangeService: " + this.userProfileService.message)
            let sendingMessage = new SendingMessage();
            sendingMessage.content = this.userProfileService.message;
            sendingMessage.type = '1';
            this.userFirstMessageInWait.push(sendingMessage);
        }

        this.connectChatServer(true);

        /* save service after selected to domain data service and main chatModel object*/
        let selectedServiceId = this.userProfileService.serviceId;
        event.serviceId = selectedServiceId;
        this.domainDataService.serviceId = selectedServiceId;
        localStorage.setItem("domain_info_" + this.domainDataService.domainCode, JSON.stringify(this.domainDataService));

        this.gainFocusOnTextInput();
    }

    senMessageWithRoleAgent(message: string) {
        let timeNowInLong = new Date().getTime();
        let chatMessage = new ChatMessageModel('greet_msg', this.channelId, this.userProfileService.name, this.userType.AGENT, this.userProfileService.userId, 'ticket_id',
            false, false, message, "", timeNowInLong + '', 'No topic', [], [], [], 0, this.messageType.TEXT, this.messageStatus.SEEN, timeNowInLong,
            false, false, '', '', '',
            '', 1, 1, false, '');
        this.chatModel.chatState.chatHistory.unshift(chatMessage);
        this.saveChatStateToStorage();
    }

    /* self-user click send button */
    onChangeBody(event: ChatClientModel) {
        if (this.connectionInWait) {
            this.connectChatServer(true);
        }

        /* Side flow */
        if (!this.chatModel.chatServerConnection && this.connectionInWait) {
            let type = event.chatMessage.type;
            let message = new SendingMessage();
            message.type = type;
            message.isReplyMessage = false;

            if (type == this.messageType.TEXT + '') {
                message.content = event.chatMessage.content;
            } else {
                let fileObject = new FileObject()
                fileObject.safeUrl = event.chatMessage.files.safeUrl;
                fileObject.originFiles = event.chatMessage.files.originFiles;
                fileObject.serverPaths = event.chatMessage.files.serverPaths;
                fileObject.names = event.chatMessage.files.names;
                fileObject.mimeTypes = event.chatMessage.files.mimeTypes;
                fileObject.types = event.chatMessage.files.types;
                fileObject.fileSizes = event.chatMessage.files.fileSizes;

                message.files = fileObject;
            }
            this.userFirstMessageInWait.push(message)
            return;
        }

        let topic: string;
        if (this.ticketId == null) {
            topic = '/topic/customer_' + this.userProfileService.userId;
        } else {
            topic = '/topic/ticket_' + this.ticketId;
        }

        let type: number = +this.chatModel.chatMessage.type;
        if (type != 1) {
            let mediaFiles: File[] = this.chatModel.chatMessage.files.originFiles
            let fileNames: string[] = this.chatModel.chatMessage.files.names
            let mimeTypes: string[] = this.chatModel.chatMessage.files.mimeTypes
            let errorMsg: string[] = this.chatModel.chatMessage.files.errorMsg
            let types: number[] = this.chatModel.chatMessage.files.types
            let fileSizes: number[] = this.chatModel.chatMessage.files.fileSizes
            let length = types.length

            if (length > 1) {
                let imageGroup: File[] = []
                let imagesSize: number = 0;
                let imageNames: string[] = []
                let imageMimeTypes: string[] = []
                let imageSafeUrls: string[] = []

                let otherFile: File[] = []
                let otherFilesNames: string[] = []
                let otherFilesMimeTypes: string[] = []
                let otherFileSizes: number[] = []
                let otherFileTypes: number[] = []
                let otherSafeUrls: string[] = []

                for (let consIndex in types) {
                    if (!types[consIndex]) return
                    let type = types[consIndex];
                    let fileName = fileNames[consIndex];

                    if (type < 0) {
                        if (type == this.errorFileType.INVALID_FORMAT || type == this.errorFileType.INVALID_SIZE) {
                            this.addContentError(errorMsg[consIndex], MessageType.USER)
                        }
                        continue;
                    }

                    let fileSize = fileSizes[consIndex];

                    /* image to be in same album */
                    if (type == this.messageType.IMAGE || type == this.messageType.STICKER || type == this.messageType.GIF) {
                        imageGroup.push(mediaFiles[consIndex])
                        imageNames.push(fileName)
                        imagesSize += fileSize
                        imageMimeTypes.push(mimeTypes[consIndex])
                        imageSafeUrls.push(this.chatModel.chatMessage.files.safeUrl[consIndex])

                    } else {
                        otherFile.push(mediaFiles[consIndex])
                        otherFilesNames.push(fileName)
                        otherFilesMimeTypes.push(mimeTypes[consIndex])
                        otherFileSizes.push(fileSize)
                        otherSafeUrls.push(this.chatModel.chatMessage.files.safeUrl[consIndex])
                        otherFileTypes.push(type)
                    }
                }

                /* Upload images to be in a same album, upload all of them once */
                if (imageGroup.length > 0) {
                    this.uploadFileToFileServerAndSendMsgToChatServerAllOnce(this.chatModel.chatMessage, imageGroup, imageSafeUrls, imageNames, imageMimeTypes, this.messageType.IMAGE)
                }

                /* mediaFiles, fileNames, mimeTypes left files that are not images in album, now upload each of them as a single message */
                if (otherFile.length > 0) {
                    this.uploadFileToFileServerAndSendMsgToChatServerEach(event, otherFile, otherSafeUrls, otherFilesNames, otherFilesMimeTypes, otherFileTypes, otherFileSizes)
                }
            } else {
                let fileType = types[0];
                if (fileType < 0) {
                    if (fileType == this.errorFileType.INVALID_FORMAT || fileType == this.errorFileType.INVALID_SIZE) {
                        this.addContentError(errorMsg[0], MessageType.USER)
                    }
                } else {
                    this.uploadFileToFileServerAndSendMsgToChatServerEach(event, mediaFiles, this.chatModel.chatMessage.files.safeUrl, fileNames, mimeTypes, types, fileSizes)
                }
            }
            this.showErrorMessages();
        } else {
            /* Send text only, timeNowInLong is important, it will be the value to match with saved message in local to update  message in local*/
            let timeNowInLong = this.getTimeNowInLong() + '';
            let messageContent = event.chatMessage.content.trim();

            if (messageContent.match(ChatClientComponent.EMOJI_ONLY_TEXT_REGEX)) {
                this.chatModel.chatMessage.onlyEmoji = true
            }

            let isReady = this.chatModel.isNetworkAvailable // temp && this.chatModel.chatServerConnection
            /* this message for save at local, then update when server receive and read using content extra value */
            let chatMessage = new ChatMessageModel('1', this.channelId, this.userProfileService.name, messageContent == "bot" ? this.userType.AGENT : this.userType.CLIENT, this.userProfileService.userId, 'ticket_id',
                this.chatModel.chatMessage.onlyEmoji, false, messageContent, "", timeNowInLong, topic, [], [], [], 0, type, isReady ? this.messageStatus.SENDING : this.messageStatus.FAILED, +timeNowInLong,
                true, this.chatModel.chatMessage.isReplyMessage, this.chatModel.chatMessage.replyMsgId, this.chatModel.chatMessage.replyMsg, this.chatModel.chatMessage.replyFiles,
                this.chatModel.chatMessage.replyFilesName, this.chatModel.chatMessage.replyType, this.chatModel.chatMessage.replyUserType, this.chatModel.chatMessage.isReplyingAlbum, '');
            this.chatModel.chatState.chatHistory.push(chatMessage);
            this.saveChatStateToStorage();

            /* send message to server */
            // if (isReady) {
                let messageOut = new MessageOut('', this.channelId, this.chatModel.conversationId, 'CHAT-CLIENT', this.userProfileService.userId, type, messageContent,
                    timeNowInLong, [], [], [0], '', '', this.domainDataService!.domainCode!, this.userProfileService.serviceId,
                    event.chatMessage.replyMsgId, this.messageStatus.SENDING, false);

                let messageOutData = {
                    "data": messageOut
                }
                this.sendMessageToChatServer(messageOutData, this.domainDataService!.realmName, this.userProfileService.userId, false);
            // }
        }
        this.chatModel.chatMessage.content = '';
    }

    checkDomainCalendar() {
        /*  Set CHAT session ready, start connecting to server*/
        console.log("Checking domain calendar after changing services...")
        this.chatModel.endChat = false;
        localStorage.setItem("endChat_" + this.domainDataService.domainCode, this.chatModel.endChat + '')
        this.gainFocusOnTextInput()

        let observable = this.chatDomainService.getDomainDataAndCalendarAndMessageDefaultAndDomainDetail(this.domainDataService.domainCode, this.domainDataService.serviceId);
        observable.subscribe(result => {
            let data = JSON.parse(JSON.stringify(result))
            let workingTimeType = data.data['WORKING_TIME_TYPE'];
            let messageDefault = data.data['MESSAGE_DEFAULT'];
            let domainDetail = data.data['DOMAIN_DETAIL'];
            let domainConfigs = data.data['PARAM_CONFIGS']
            let sourceId = data.data['SOURCE_ID']
            if (workingTimeType) {
                this.domainDataService.workingTimeType = workingTimeType
            }
            if (messageDefault) {
                this.domainDataService.domainMessageDefault = messageDefault;
            }
            if (domainDetail) {
                this.domainDataService.domainDetail = domainDetail;
            }
            if (domainConfigs) {
                this.domainDataService.configParams = domainConfigs;
            }
            if (sourceId) {
                this.domainDataService.sourceId = sourceId;
            }
            this.domainDataEventService.reloadUploadingConfigs(true)
        }, error => {
            console.log(error)
            console.log("Error when loading domain and calendar and messages from chat-service: loadRestOfData");
            // let openedChat = localStorage.getItem('open-chat') == 'true';
            // if (openedChat) {
            //     this.showIcon = false;
            // }
            //
            // /* compare*/
            // this.setAvatarPathForSmallIcon(this.domainDataService.avatarImg, this.domainDataService.realmName)
            // this.setLanguageByDomainLanguage(this.domainDataService.language)
            // this.checkShowService();
            //
            // // save to local and compare
            // this.saveDomainDataToLocalAndOpenChat()
        })
    }

    resendMessage(messageModel: ChatMessageModel) {
        this.saveChatStateToStorage();
        window.setTimeout(() => {
            if (this.chatModel.isNetworkAvailable) {
                let contentExtra = messageModel.contentExtra;
                let messageType = messageModel.type;

                let messageOut = new MessageOut('', this.channelId, this.chatModel.conversationId, 'CHAT-CLIENT', this.userProfileService.userId, messageModel.type, messageModel.content,
                    contentExtra, [], [], [0], '', '', this.domainDataService!.domainCode!, this.userProfileService.serviceId,
                    messageModel.replyMsgId, this.messageStatus.SENDING, false);
                let messageOutData = {data: messageOut};
                console.log("Re-sending messages by recognizer: " + contentExtra)
                if (messageType == 1) {
                    this.sendMessageToChatServer(messageOutData, this.domainDataService.realmName, this.userProfileService.userId, false);
                } else {
                    if (messageModel.files.length == 0) {
                        /* mean: original message failed before upload file to file server, not event close to chat-server :( */
                        let fileIndex = this.failedMessages.findIndex(failedMessage => failedMessage.contentExtra == contentExtra);
                        if (fileIndex == -1) {
                            console.log("Not found message with recognizer: " + contentExtra)
                            window.setTimeout(() => {
                                messageModel.status = this.messageStatus.FAILED
                                this.saveChatStateToStorage();
                            }, 1000)
                            return
                        }

                        let files = this.failedMessages[fileIndex];

                        let fileResponse = this.uploadFile(files.data);
                        fileResponse.subscribe(fileRes => {
                            let jsonObject = JSON.parse(JSON.stringify(fileRes));
                            let filePaths: string[] = [];
                            for (let data of jsonObject.data) {
                                filePaths.push(data.filePath)
                            }
                            messageOut.fileUrl = filePaths;
                            this.sendMessageToChatServer(messageOutData, this.domainDataService!.realmName, this.userProfileService.userId, true);
                        }, error => {
                            console.log("Failed to re-upload file!");
                            console.log(error);
                            /* save attachment of failed message to list */
                            this.markFailedMessage(contentExtra)
                            this.failedMessages.push({contentExtra: contentExtra, data: files.data});

                            let message = error.error.message
                            if (message) {
                                this.addContentError(message, MessageType.SERVER)
                            } else {
                                this.addError('', 'chat.chat-server.db-error', MessageType.SERVER)
                            }
                            this.showErrorMessages()
                        })

                        /* remove old failed files */
                        this.failedMessages.splice(fileIndex, 1);
                    } else {
                        /* mean: original message successfully upload file to server, failed when send message to server*/
                        this.sendMessageToChatServer(messageOutData, this.domainDataService.realmName, this.userProfileService.userId, false);
                    }
                }
            } else {
                console.log("No connection to re-send!")
            }
        }, 1000)
    }

    sendMessageToChatServer(messageOutData: any, realmName: string, userId: string, hasFile: boolean) {
        /* if no internet, then show failed message status right away*/
        let isReady = this.chatModel.isNetworkAvailable // temp && this.chatModel.chatServerConnection
        if (!isReady) {
            let contentExtra = messageOutData.data.contentExtra;
            this.markFailedMessage(contentExtra)
            this.saveChatStateToStorage();
            return;
        }

        this.chatServerService.sendMessage(messageOutData, realmName, this.userProfileService.userId).subscribe(res => {
            console.log("Send MESSAGE successfully, has file: " + hasFile)
            /*now update id, status, fileUrls back to local images*/
            let data = JSON.parse(JSON.stringify(res)).data;
            let contentExtra = data.contentExtra;
            let chatMessage = this.getMessageFromLocalStorageByContentExtra(contentExtra);
            if (chatMessage) {
                chatMessage.messageId = data.id;
                chatMessage.status = this.messageStatus.SENT

                if (hasFile) {
                    chatMessage.files = data.fileUrl;
                }
                this.saveChatStateToStorage();
            } else {
                console.error('Can not found message: ' + contentExtra + ' to update status and Id for message')
            }
        }, error => {
            console.error("Error when sending MESSAGE to chat-server!")
            console.log(error);

            /* case send message failed, show status for client */
            let contentExtra = messageOutData.data.contentExtra;
            this.markFailedMessage(contentExtra)
            this.saveChatStateToStorage();
        })
    }

    getSeenStatus() {
        let seenStatusObservable: Observable<any> = this.chatServerService.getSeen(this.domainDataService.realmName, this.chatModel.conversationId);
        seenStatusObservable.subscribe(result => {
            this.handleSeenStatus(result);
        }, error => {
            console.log("Get seen status failed!")
            console.log(error)
        })
    }

    handleSeenStatus(result: any) {
        let data1 = JSON.parse(JSON.stringify(result)).data;
        if (!data1 || data1.length == 0) return
        for (let data of data1) {
            if (data.user.id == this.userProfileService.userId) continue;

            let lastReadAt = data.lastReadAt;
            if (lastReadAt > 0) {
                let startedCheck = false;

                let chatHistory = this.chatModel.chatState.chatHistory;
                let length = chatHistory.length;
                for (let index = length - 1; index >= 0; index--) {
                    let chatMessage = chatHistory[index];
                    if (!startedCheck) {
                        if (chatMessage.sendTime - 2000 <= lastReadAt && (chatMessage.status == this.messageStatus.SENT || chatMessage.status == this.messageStatus.SENDING)) {
                            chatMessage.status = this.messageStatus.SEEN;
                            startedCheck = true
                        }
                    } else {
                        if (chatMessage.status == this.messageStatus.SEEN && chatMessage.userType == this.userType.CLIENT) {
                            break;
                        } else {
                            chatMessage.status = this.messageStatus.SEEN;
                        }
                    }
                }
            }
        }
        this.saveChatStateToStorage();
    }

    markFailedMessage(contentExtra: string) {
        let chatMessage = this.getMessageFromLocalStorageByContentExtra(contentExtra);
        if (chatMessage) {
            chatMessage.status = this.messageStatus.FAILED
        }
    }

    /* Upload album */
    uploadFileToFileServerAndSendMsgToChatServerAllOnce(currentMessageData: any, mediaFiles: File[], safeUrls: string[], fileNames: string[]
        , mimeTypes: string[], type: number) {
        let timeNow = this.getTimeNowInLong() + '';

        /* album so size is not necessary */
        let fileSize = 0;

        /* Now save to local */
        let isReady = this.chatModel.isNetworkAvailable && this.chatModel.chatServerConnection
        let chatMessage = new ChatMessageModel('1', this.channelId, this.userProfileService.name, this.userType.CLIENT, this.userProfileService.userId, 'ticket_id',
            false, false, "", "", timeNow, this.topic, safeUrls, [], fileNames, fileSize, type, isReady ? this.messageStatus.SENDING : this.messageStatus.FAILED, +timeNow,
            true, currentMessageData.isReplyMessage, currentMessageData.replyMsgId, currentMessageData.replyMsg, currentMessageData.replyFiles,
            currentMessageData.replyFilesName, currentMessageData.replyType, currentMessageData.replyUserType, currentMessageData.isReplyingAlbum, '');
        this.chatModel.chatState.chatHistory.push(chatMessage);
        this.saveChatStateToStorage();
        this.scrolltoBottom$.next(true)

        if (isReady) {
            let messageOut = new MessageOut('', this.channelId, this.chatModel.conversationId, 'CHAT-CLIENT', this.userProfileService.userId, type, '',
                timeNow, [], [], [0], '', '', this.domainDataService!.domainCode!, this.userProfileService.serviceId,
                currentMessageData.replyMsgId, this.messageStatus.SENDING, false);

            messageOut.type = type;
            messageOut.fileSize = [fileSize]
            messageOut.fileName = fileNames

            let messageOutData = {
                "data": messageOut
            }

            let fileResponse = this.uploadFile(mediaFiles);
            fileResponse.subscribe(fileRes => {
                let jsonObject = JSON.parse(JSON.stringify(fileRes));
                let filePaths: string[] = [];
                for (let data of jsonObject.data) {
                    filePaths.push(data.filePath)
                }

                messageOut.fileUrl = filePaths;
                this.sendMessageToChatServer(messageOutData, this.domainDataService!.realmName, this.userProfileService.userId, true);
            }, error => {
                console.log("Failed to upload file in album!");
                console.log(error);
                this.markFailedMessage(timeNow)
                this.saveChatStateToStorage();
                /* save attachment of failed message to list */
                this.failedMessages.push({contentExtra: timeNow, data: mediaFiles});

                if (error.error && error.error.message) {
                    let message = error.error.message
                    if (message) {
                        this.addContentError(message, MessageType.SERVER)
                    } else {
                        this.addError('', 'chat.chat-server.db-error', MessageType.SERVER)
                    }
                    this.showErrorMessages()
                }
            })
        } else {
            /* save attachment of failed message to list */
            console.log("No connection!")
            this.failedMessages.push({contentExtra: timeNow, data: mediaFiles});
        }
    }

    uploadFileToFileServerAndSendMsgToChatServerEach(event: ChatClientModel, mediaFiles: File[], safeUrls: string[], fileNames: string[]
        , mimeTypes: string[], notImageTypeArray: number[], fileSizes: number[]) {

        let messageOut = new MessageOut('', this.channelId, this.chatModel.conversationId, 'CHAT-CLIENT', this.userProfileService.userId, 0, event.chatMessage.content,
            '', [], [], [0], '', '', this.domainDataService!.domainCode!, this.userProfileService.serviceId,
            event.chatMessage.replyMsgId, this.messageStatus.SENDING, false);

        let messageOutData = {
            "data": messageOut
        }

        /* show local */
        let messageRecognizers: string[] = [];
        let isReady = this.chatModel.isNetworkAvailable && this.chatModel.chatServerConnection
        for (let index in fileNames) {
            let timeInLong = this.getTimeNowInLong();
            let safeUrl = [safeUrls[index]]
            let fileName = [fileNames[index]];
            let type = notImageTypeArray[index];
            let fileSize = fileSizes[index];

            /* now save to local then update when server receive and read */
            let contentExtra = timeInLong + index + '';
            messageRecognizers.push(contentExtra)
            let chatMessage = new ChatMessageModel('', this.channelId, this.userProfileService.name, this.userType.CLIENT, this.userProfileService.userId, 'ticket_id',
                false, false, '', '', contentExtra, this.topic, safeUrl, [], fileName, fileSize, type, isReady ? this.messageStatus.SENDING : this.messageStatus.FAILED, timeInLong,
                true, this.chatModel.chatMessage.isReplyMessage, this.chatModel.chatMessage.replyMsgId, this.chatModel.chatMessage.replyMsg, this.chatModel.chatMessage.replyFiles,
                this.chatModel.chatMessage.replyFilesName, this.chatModel.chatMessage.replyType, this.chatModel.chatMessage.replyUserType, this.chatModel.chatMessage.isReplyingAlbum, '');
            this.chatModel.chatState.chatHistory.push(chatMessage);

            if (!isReady) {
                this.failedMessages.push({contentExtra: contentExtra, data: [mediaFiles[index]]});
            }
        }
        this.saveChatStateToStorage();
        this.scrolltoBottom$.next(true)

        isReady = this.chatModel.isNetworkAvailable && this.chatModel.chatServerConnection
        if (isReady) {
            let fileResponse = this.uploadFile(mediaFiles);
            fileResponse.subscribe(result => {
                let jsonObject = JSON.parse(JSON.stringify(result));
                let dataArray = jsonObject.data;
                let length = dataArray.length;
                for (let dataIndex in dataArray) {
                    let index = +dataIndex
                    if (index == length) break;

                    let paths = [dataArray[index].filePath]
                    let fileName = [fileNames[index]];
                    let type = notImageTypeArray[index]
                    let contentExtra = messageRecognizers[index];

                    messageOut.fileUrl = paths;
                    messageOut.fileName = fileName;
                    messageOut.type = type;
                    messageOut.contentExtra = contentExtra;
                    messageOut.fileSize = [fileSizes[index]];

                    this.sendMessageToChatServer(messageOutData, this.domainDataService!.realmName, this.userProfileService.userId, true);
                }
            }, error => {
                console.error('Can not upload files: ' + fileNames)
                console.error(error)

                for (let index in fileNames) {
                    let contentExtra = messageRecognizers[index];
                    this.failedMessages.push({contentExtra: contentExtra, data: [mediaFiles[index]]});
                }

                /* case internet ok, but FILE SERVER DIED */
                for (let contentExtra of messageRecognizers) {
                    this.markFailedMessage(contentExtra);
                    this.saveChatStateToStorage();
                }

                let message = error.error.message
                if (message) {
                    this.addContentError(message, MessageType.SERVER)
                } else {
                    this.addError('', 'chat.chat-server.db-error', MessageType.SERVER)
                }
                this.showErrorMessages()
            })
        } else {
            /* case internet lost!! */
            for (let contentExtra of messageRecognizers) {
                this.markFailedMessage(contentExtra);
                this.saveChatStateToStorage();
            }
        }
    }

    uploadFile(file: File[] | File) {
        return this.fileService.uploadFilesPublic(file, ChannelUploadType.PORTAL, this.domainDataService.realmName, this.domainDataService.service.serviceCode
            , this.domainDataService.service.serviceId, this.domainDataService.domainCode);
    }

    connectChatServer(doConnect: boolean) {
        this.chatModel.attempToConnectChatServer = true;
        // this.chatDomainService.token(navigator.userAgent).subscribe(res => {
        /* Res la dai dien cho browser cua user */
        let clientId: any;

        if (localStorage.getItem("clientId" + this.domainDataService.domainId)) {
            clientId = localStorage.getItem("clientId" + this.domainDataService.domainId);
        } else {
            clientId = btoa(uuidv4().replace(/-/g, ""));
            localStorage.setItem("clientId" + this.domainDataService.domainId, clientId);
        }

        let jsonData = {
            "data": new UserRegisterChatServerModel(clientId, this.domainDataService?.domainId, this.userProfileService.serviceId, this.userProfileService.name?.trim(), this.userProfileService.email?.trim(), this.userProfileService.phone?.trim())
        }

        if (this.userProfileService.externalId != null && this.userProfileService.externalId != '' && this.userProfileService.externalId != 'null') {
            jsonData.data.externalId = this.userProfileService.externalId.trim();
        } else {

        }

        if (this.userProfileService.userCode != null && this.userProfileService.userCode != '') {
            jsonData.data.userCode = this.userProfileService.userCode.trim();
        }

        this.chatServerService.registerUser(jsonData, this.domainDataService!.realmName!).subscribe(result => {
            let jsonObject = JSON.parse(JSON.stringify(result));

            if (jsonObject.status && (jsonObject.status == 400 || jsonObject.status != this.connectStatus.SUCCESS)) {
                this.addError('', 'chat.chat-server.db-error', MessageType.SERVER)
                this.showErrorMessages()
            }

            /*  Set user info for user service*/
            this.userProfileService.userId = jsonObject.data.user.id;
            this.userProfileService.sessionToken = jsonObject.data.user.sessionToken;
            this.userProfileService.role = jsonObject.data.user.role;
            if (!this.userProfileService.serviceId) {
                let savedCustomerInfo = localStorage.getItem('customerInfo_' + this.domainDataService.domainId);
                this.userProfileService.saveDataClient(JSON.parse(savedCustomerInfo!))
            }

            // this.saveCustomerInfoToStorage();

            /* Connect to chat-server using Web socket */
            this.chatServerStompService.connectToChatServer(this.userProfileService.sessionToken, this.userProfileService.userId, this.domainDataService.realmName, doConnect);

            /* Restore old message saved in local storage */
            this.loadHistoryDataChat();

        }, error => {
            console.log('Init user error!!')
            console.log(error)
            this.chatModel.attempToConnectChatServer = false;
            let errorMsg = error.error && error.error.message;
            if (!errorMsg || (errorMsg && errorMsg.indexOf("data.") >= 0)) errorMsg = this.translateService.instant('chat.chat-server.db-error')
            this.addContentError(errorMsg, MessageType.SERVER)
            this.showErrorMessages()
            this.restoreChatFromLocal()
        })
    }

    private loadHistoryDataChat() {
        this.chatServerService.getUserConversation().subscribe(conRes => {
            let conversationIds = conRes.data;
            localStorage.setItem('userConversations', JSON.stringify(conversationIds));
            this.loadHistoryMessage(0);
        }, error => {
            this.loadHistoryMessage(0);
        });
    }

    private sendGreetMessageDefault() {
        if (this.domainDataService.domainMessageDefault.content && this.domainDataService.domainMessageDefault.content != ''
            && !this.openFromHeader && this.chatModel.chatState.chatHistory.length == 0) {
            this.senMessageWithRoleAgent(this.domainDataService.domainMessageDefault.content)
        }
    }

    public addError(paramValue: string, errorKey: string, type: MessageType) {
        this.chatModel.notifyMessage.push(paramValue ? new MessageModel(paramValue, this.translateService.instant(errorKey, {param: paramValue}), type, MessageFlag.ERROR)
            : new MessageModel("", this.translateService.instant(errorKey), type, MessageFlag.ERROR));
    }

    public addInfo(paramValue: string, errorKey: string, type: MessageType) {
        this.chatModel.notifyMessage.push(paramValue ? new MessageModel(paramValue, this.translateService.instant(errorKey, {param: paramValue}), type, MessageFlag.INFO)
            : new MessageModel("", this.translateService.instant(errorKey), type, MessageFlag.INFO));
    }

    public addContentError(messageContent: string, type: MessageType) {
        this.chatModel.notifyMessage.push(new MessageModel('', messageContent, type, MessageFlag.ERROR));
    }

    public showErrorMessages() {
        if (this.chatModel.notifyMessage && this.chatModel.notifyMessage.length > 0) {
            this.chatModel.showError = true
            window.setTimeout(() => {
                this.chatModel.showError = false;
                this.chatModel.notifyMessage = []
            }, 3000 + (this.chatModel.notifyMessage.length * 1000))
        }
    }

    protected saveChatStateToStorage() {
        localStorage.setItem('chatState_' + this.domainDataService?.domainId, JSON.stringify(this.chatModel.chatState));
    }

    protected saveCustomerInfoToStorage() {
        localStorage.setItem('customerInfo_' + this.domainDataService.domainId, JSON.stringify(this.userProfileService.getDataClient()));
    }

    private restoreChatFromLocal() {
        if (localStorage.getItem('chatState_' + this.domainDataService?.domainId) !== null) {
            /* Filter out message that are normal and failed message which is text only. */
            // @ts-ignore
            this.chatModel.chatState = JSON.parse(localStorage.getItem('chatState_' + this.domainDataService.domainId));
            this.chatModel.chatState.chatHistory = this.chatModel.chatState.chatHistory
                .filter(chat => (chat.type == this.messageType.TEXT || (chat.type != this.messageType.TEXT && chat.status != this.messageStatus.FAILED)))
        } else {
            this.chatModel.chatState = new ChatClientStateModel();
        }
        this.scrolltoBottom$.next(true)

        this.sendSeenAndGetSeenStatusToChatServer();
    }

    private sendSeenAndGetSeenStatusToChatServer() {
        /* when open chat from close state, send seen status using id of last message to server also get seen status as well*/
        if (this.chatModel.showChatBox && this.chatModel.chatState.chatHistory.length > 0) {
            let conversationId = this.chatModel.conversationId;
            if (conversationId) {
                this.getSeenStatus()
            }else {
                console.log("Do not get seen due to no conversation ID")
            }

            let lastMessageId = this.chatModel.chatState.chatHistory[this.chatModel.chatState.chatHistory.length - 1].messageId
            if (lastMessageId) {
                this.sendSeenStatusToChatServer(lastMessageId)
            }
        }
    }

    gainFocusOnTextInput() {
        if (this.chatModel.endChat) return;
        let element = window.document.getElementById('box-chat-input');
        element?.focus();
    }

    private sendSeenStatusToChatServer(id: string) {
        if (this.userProfileService.userId && this.userProfileService.serviceId) {
            let messageOutData = {
                "data": {
                    lastReadAt: new Date().getTime(),
                    messageId: id,
                    serviceId: this.userProfileService.serviceId
                }
            }
            let seenObservable = this.chatServerService.sendSeen(messageOutData, this.domainDataService!.realmName!, this.userProfileService.userId)
            seenObservable.subscribe(seenResult => {
            }, error => {
                console.log("Send seen status manually failed")
                console.log(error);
            })
        }else {
            console.log("Do not send seen due to no USER ID | SERVICE ID")
        }
    }

    loadHistoryMessage(index: number) {
        // @ts-ignore
        let allConversationUser = JSON.parse(localStorage.getItem('userConversations'));
        if (!allConversationUser) {
            this.sendGreetMessageDefault();
            return;
        }
        if (index >= allConversationUser.length) {
            this.sendGreetMessageDefault();
            this.sendSeenAndGetSeenStatusToChatServer();
            this.saveChatStateToStorage();
            return;
        }
        let conversationId = allConversationUser[index];
        this.chatModel.conversationId = conversationId;
        this.chatServerService.getChatHistory(conversationId, 0, 20).subscribe(hisRes => {
            if (hisRes == null) {
                this.loadHistoryMessage(index + 1);
            } else {
                let data = hisRes.data;
                for (let i = 0; i < data.length; i++) {
                    let messData = data[i];
                    let exist = this.chatModel.chatState.chatHistory.some((x: ChatMessageModel) => x.messageId == messData.objectId);

                    if (!exist) {
                        let reliable = true;
                        let sendSeen = true;
                        if (messData.contentType == this.messageType.END_CHAT) {
                            reliable = false;
                            // this.disableReplyOldMessages(messData.objectId);
                        } else if (messData.contentType == this.messageType.WARNING_END) {
                            console.log("WARNING end chat!")
                            reliable = false;
                        }

                        if (this.domainDataService.workingTimeType == this.WORKING_TYPE.OUT_TIME) {
                            this.domainDataService.workingTimeType = this.WORKING_TYPE.IN_TIME
                        }

                        let sender;
                        if (messData.messageDirection == 2) {
                            if (messData.agentName) {
                                sender = messData.agentName;
                            } else sender = 'SYSTEM';
                        } else if (messData.messageDirection == 3) {
                            sender = 'SYSTEM';
                        } else if (messData.messageDirection == 1) {
                            sender = this.userProfileService.name;
                        }
                        let sendStatus = this.messageStatus.SENT;
                        let isReplyMessage = false;
                        let replyFilesName = '';
                        let replyMsg = '';
                        let replyFiles = '';
                        let replyType = this.messageType.TEXT;
                        let replyId = messData?.parentTicketDetail?.objectId;
                        let replyUserType = this.userType.CLIENT;
                        let isReplyingAlbum = false;
                        if (replyId) {
                            isReplyMessage = true;
                            if (messData.parentTicketDetail && messData.parentTicketDetail.attachments != null) {
                                replyFilesName = messData.parentTicketDetail.attachments[0].fileName;
                                replyFiles = this.fileService.getURLContentFilePublic(messData.parentTicketDetail.attachments[0].storeFilePath, this.domainDataService.realmName);
                            }
                            if (messData.parentTicketDetail.content) {
                                replyMsg = messData.parentTicketDetail.content;
                            } else {
                                replyMsg = "";
                            }
                            replyType = messData.parentTicketDetail.contentType;
                            replyUserType = messData.parentTicketDetail.messageType;
                            isReplyingAlbum = this.isReplyingAlbum(replyId);
                        }

                        let survey: SurveyParamModel = new SurveyParamModel();
                        let fileNames: string[] = [];
                        let fileSizes: number = 0
                        let files: string[] = []
                        let type = messData.contentType;
                        let onlyEmoji = false;
                        let hasSurvey = false;
                        if (type == this.messageType.TEXT || type == this.messageType.END_CHAT || type == this.messageType.WARNING_END) {
                            if (messData.content.match(ChatClientComponent.EMOJI_ONLY_TEXT_REGEX)) {
                                onlyEmoji = true
                            }
                        } else if (type == this.messageType.SURVEY) {
                            /* SURVEY */
                            reliable = false;
                            hasSurvey = true;
                            sendStatus = this.messageStatus.SEEN
                            survey.clientId = messData.surveyClientId
                            survey.realmName = this.domainDataService.realmName
                            // this.disableReplyOldMessages(messData.objectId);
                        } else if (type == this.messageType.MISS) {
                            reliable = false;
                            sendStatus = this.messageStatus.SEEN
                        } else {
                            if (messData.attachments) {
                                fileNames = messData.attachments.map((att: any) => att.fileName);
                                fileSizes = messData.attachments.map((att: any) => {
                                    if (att.fileSize) {
                                        return att.fileSize;
                                    } else return 0;
                                });
                                files = messData.attachments.map((att: any) => att.storeFilePath)
                            }
                        }
                        let ticketDetailId = messData.ticketDetailId;
                        let chatMessage = new ChatMessageModel(messData.objectId, this.channelId, sender, messData.messageDirection, messData.authorId, 'ticket_id', onlyEmoji,
                            hasSurvey, messData.content, "", '', this.topic, [], files, fileNames, fileSizes, type, this.messageStatus.SENT, messData.createTime,
                            reliable, isReplyMessage, replyId, replyMsg, replyFiles, replyFilesName, replyType, replyUserType, isReplyingAlbum, ticketDetailId);

                        if (survey) {
                            chatMessage.survey = survey;
                        }
                        this.chatModel.chatState.chatHistory.unshift(chatMessage);
                    }

                    this.chatModel.chatState.chatHistory = this.chatModel.chatState.chatHistory
                        .filter(chat => (chat.type == this.messageType.TEXT || (chat.type != this.messageType.TEXT && chat.status != this.messageStatus.FAILED)))

                    this.scrolltoBottom$.next(true)
                }
                this.lastOffsetCon = index;
                if (this.chatModel.chatState.chatHistory.length < 20) {
                    this.loadHistoryMessage(index + 1);
                }
            }
        }, error => {
            console.error("Error when get chat history!")
            console.log(error);
            this.restoreChatFromLocal()
            this.scrolltoBottom$.next(true)
        })
    }
}
