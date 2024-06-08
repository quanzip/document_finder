import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {ChatClientModel, FileObject} from '../../../../shared/models/chat-client/chat-client.model';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ChatMessageModel} from "../../../../shared/models/chat-client/chat-message.model";
import {DatePipe} from "@angular/common";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {DomainDataService} from "../../../../core/services/domain-data.service";
import {UserProfileService} from "../../../../core/services/user-data.service";
import {concat, fromEvent, merge, of, Subject, Subscription} from "rxjs";
import {delay, distinctUntilChanged, map, switchMap} from "rxjs/operators";
import {ChatDomainService} from "../../../../shared/services/chat-client/chat.domain.service";
import {saveAs} from "file-saver";
import {PROPERTIES, SERVICES} from "../../../../../environments/environment";
import {FileService} from "../../../../shared/services/chat-client/file.service";
import {ChatServerService} from "../../../../shared/services/chat-client/chat-server.service";
import {SurveyParamModel} from "../../../../shared/models/chat-client/survey-param.model";
import {MessageFlag} from "../../../../shared/models/chat-client/messageModel";
import {SuggestService} from "../../../../shared/services/chat-client/suggest.service";
import {HistoryService} from "../../../../shared/services/chat-client/history.service";
import {ConfirmModel} from "../../../../shared/models/chat-client/confirm.model";
import {DocumentItem} from "../../../../shared/models/chat-client/documentItem";

@Component({
    selector: 'app-chat-body',
    templateUrl: './chat-body.component.html',
    styleUrls: ['../chat-client.component.scss', './chat-body.component.scss']
})

export class ChatBodyComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() chatModel: ChatClientModel = new ChatClientModel();
    @Input() profile: String | undefined;
    @Input() lastOffsetCon: number = 0;
    @Output() resend = new EventEmitter<ChatMessageModel>();
    @Output() changeHeader = new EventEmitter<ChatClientModel>();
    @Output() changeBody = new EventEmitter<ChatClientModel>();
    @Output() rejectConfirm = new EventEmitter<any>();
    @Output() conversationEnded = new EventEmitter<boolean>()
    @ViewChild('userChat') userChat: ElementRef | undefined;
    @ViewChild('scrollRef') scrollRef: any | undefined;
    @ViewChild('inputContent') chatInputElement: ElementRef | undefined;
    @ViewChild('loadingOldButton') loadingOldButton: ElementRef | undefined;
    observerForLoadMore?: IntersectionObserver;

    @Input() scrollToBottom: Subject<boolean> | undefined;
    @Input() typingSignal: Subject<boolean> | undefined;
    typingSub?: Subscription

    protected chatDomainService: ChatDomainService;

    public isreplyMessage = false;
    public hasSuggest = false;
    public showHistory = false;
    protected isHavingAttach = false;
    public typingUrl = '.\\assets\\images\\typing.gif'
    smallAvatar: string = ''
    textLengthToBreakLine = PROPERTIES.AllowTextInput

    private suggests: any = [];

    private submitChatSrc = new Subject();
    private fileDownloadSubscription: Subscription | undefined;
    private openSurveySubscription: Subscription | undefined;
    private scrollSubscription: Subscription | undefined;
    private chatServerService: ChatServerService;
    private lastConversationId: string = "";
    private lastOffsetMess: number = 1;
    private allConversationUser: string[] = [];
    private firstRestoreChatState = true;
    messageFlag = MessageFlag;
    public connectStatus = {
        SUCCESS: "success",
        FAILED: "failed",
        ERROR: "error"
    }
    public userType = {
        AGENT: 2,
        CLIENT: 1
    }
    public messageType = {
        TEXT: 1,
        FILE: 2,
        IMAGE: 8,
        STICKER: 15,
        GIF: 17,
        AUDIO: 3,
        VIDEO: 4,
        TYPING: 16,
        WARNING_END: 21,
        END_CHAT: 22,
        BLOCKED_MSG: 24,
        SURVEY: 27,
        MISS: 28,
        CONFIRM: 30
    }
    public errorFileType = {
        INVALID_FORMAT: -2,
        INVALID_SIZE: -1
    }
    public WORKING_TYPE = {
        IN_TIME: 1,
        OUT_TIME: 2
    }
    private channelId = 5;
    public messageStatus = {
        FAILED: 0,
        SENT: 1,
        SEEN: 2,
        SENDING: 3
    }
    public loading = false;
    private topic = '/topic/customer_chat_receive' + this.domainDataService.realmId + '_' + this.userProfileService.userId;

    private EMOJI_ONLY_TEXT_REGEX = /^[\p{Extended_Pictographic}\s]+$/u;

    constructor(private modalService: NgbModal, public domainDataService: DomainDataService, public fileService: FileService
        , public userDataService: UserProfileService, injector: Injector, private userProfileService: UserProfileService, private sanitizer: DomSanitizer,
                private suggestService: SuggestService, private historyAskDocumentService: HistoryService) {
        this.chatServerService = injector.get(ChatServerService);
        this.chatDomainService = injector.get(ChatDomainService);
    }

    ngOnDestroy() {
        this.typingSub?.unsubscribe()
        this.fileDownloadSubscription?.unsubscribe();
        this.scrollSubscription?.unsubscribe();
        this.openSurveySubscription?.unsubscribe();
        localStorage.setItem('open-chat', "false");
    }


    initIntersectionObserver(container: HTMLElement) {
        let handleIntersect = (entries: any[], observer: any) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {

                    if (!this.firstRestoreChatState) {
                        this.loadHistoryMessage();
                    } else {
                        this.firstRestoreChatState = false;
                    }
                }
            });
        }

        let options = {
            root: container,
            rootMargin: "500px 0px 0px 0px",
            threshold: 1.0,
        };
        this.observerForLoadMore = new IntersectionObserver(handleIntersect, options);
        // this.observerForLoadMore.observe(this.loadingOldButton?.nativeElement)
    }

    disableReplyOldMessages(id: string) {
        for (let oldMess of this.chatModel.chatState.chatHistory) {
            oldMess.isRepliable = false;
            if (oldMess.messageId == id) {
                this.saveChatStateToStorage();
                return;
            }
        }
        this.saveChatStateToStorage();
    }

    loadHistoryMessage() {
        if (this.chatModel.chatState.chatHistory.length < 20) {
            this.lastOffsetMess = 1;
            this.lastOffsetCon = this.lastOffsetCon + 1;
            this.lastConversationId = this.allConversationUser[this.lastOffsetCon];
        }

        // @ts-ignore
        this.allConversationUser = JSON.parse(localStorage.getItem('userConversations'));
        if (this.lastOffsetCon < this.allConversationUser.length) {
            this.loading = true;
            this.lastConversationId = this.allConversationUser[this.lastOffsetCon];
            this.chatServerService.getChatHistory(this.lastConversationId, this.lastOffsetMess, 20).subscribe(hisRes => {
                this.loading = false;
                let data = hisRes.data;
                if (data != null) {
                    if (data.length < 20) {
                        this.lastOffsetMess = 1;
                        this.lastOffsetCon = this.lastOffsetCon + 1;
                        this.lastConversationId = this.allConversationUser[this.lastOffsetCon];
                    } else {
                        this.lastOffsetMess = this.lastOffsetMess + 20;
                    }

                    for (let i = 0; i < data.length; i++) {
                        let messData = data[i];
                        let exist = this.chatModel.chatState.chatHistory.some((x: ChatMessageModel) => x.messageId == messData.objectId);
                        if (!exist) {
                            let reliable = true;
                            let sendSeen = true;
                            if (messData.contentType == this.messageType.END_CHAT) {
                                reliable = false;
                                this.disableReplyOldMessages(messData.objectId);
                            } else if (messData.contentType == this.messageType.WARNING_END || messData.contentType == this.messageType.CONFIRM ) {
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
                            let isReplyMessage = false;
                            let replyFilesName = '';
                            let replyMsg = '';
                            let replyFiles = '';
                            let replyType = this.messageType.TEXT;
                            let replyId = messData?.parentTicketDetail?.objectId;
                            let replyUserType = this.userType.CLIENT;
                            let isReplyingAlbum = false;
                            let hasSurvey = false;
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
                            if (type == this.messageType.TEXT || type == this.messageType.END_CHAT || type == this.messageType.WARNING_END || type == this.messageType.MISS) {
                                if (messData.content.match(this.EMOJI_ONLY_TEXT_REGEX)) {
                                    onlyEmoji = true
                                }
                            } else if (type == this.messageType.SURVEY) {
                                /* SURVEY */
                                reliable = false;
                                hasSurvey = false;
                                survey.clientId = messData.surveyClientId
                                survey.realmName = messData.realmName
                            } else {
                                fileNames = messData.attachments.map((att: any) => att.fileName);
                                fileSizes = messData.attachments.map((att: any) => {
                                    if (att.fileSize) {
                                        return att.fileSize;
                                    } else return 0;
                                });
                                files = messData.attachments.map((att: any) => att.storeFilePath)
                            }
                            let ticketDetailId = messData.ticketDetailId;
                            let chatMessage = new ChatMessageModel(messData.objectId, this.channelId, sender, messData.messageDirection, messData.authorId, 'ticket_id', onlyEmoji,
                                hasSurvey, messData.content, "", messData.contentExtra, this.topic, [], files, fileNames, fileSizes, type, this.messageStatus.SENT, messData.createTime,
                                reliable, isReplyMessage, replyId, replyMsg, replyFiles, replyFilesName, replyType, replyUserType, isReplyingAlbum, ticketDetailId);

                            if (survey) {
                                chatMessage.survey = survey;
                            }
                            this.chatModel.chatState.chatHistory.unshift(chatMessage);
                            this.saveChatStateToStorage();
                        }
                    }

                    this.chatModel.chatState.chatHistory = this.chatModel.chatState.chatHistory
                        .filter(chat => (chat.type == this.messageType.TEXT || (chat.type != this.messageType.TEXT && chat.status != this.messageStatus.FAILED)))
                } else {
                    this.lastOffsetMess = 1;
                    this.lastOffsetCon = this.lastOffsetCon + 1;
                    this.lastConversationId = this.allConversationUser[this.lastOffsetCon];
                }
            }, error => {
                console.error("Error when get chat history!")
                console.log(error);
            })
        } else console.log("reach max conversation");
    }

    protected saveChatStateToStorage() {
        localStorage.setItem('chatState_' + this.domainDataService?.domainId, JSON.stringify(this.chatModel.chatState));
    }

    public rejectConfirmQuestion(index: any) {
        this.chatServerService.sendNotFoundSolutionQuestion(this.chatModel.chatState.chatHistory[index].confirmModel).subscribe((res: any) => {
            this.rejectConfirm.emit(res[0])
            this.chatModel.chatState.chatHistory[index].confirmModel!!.rejected = true
        }, error => console.log(error));
    }

    startNewConversation() {
        this.resetCurrentMessage();
        window.setTimeout(() => {
            this.conversationEnded.emit(true);
        }, 500)
        window.setTimeout(() => {
            this.gainFocusOnTextInput()
        }, 1000)
    }

    getDateAndTimeFromLong(time: number) {
        let sd = new Date(time);
        let datePipe = new DatePipe('en-US');
        return datePipe.transform(sd, "dd/MM HH:mm:ss")
    }

    getTimeFromLong(time: number) {
        let sd = new Date(time);
        let datePipe = new DatePipe('en-US');
        return datePipe.transform(sd, "HH:mm:ss")
    }

    getDateFromLong(time: number) {
        let sd = new Date(time);
        let datePipe = new DatePipe('en-US');
        return datePipe.transform(sd, "dd/MM/yyyy")
    }

    scrollToMessage(replyingMsgId: string) {
        document.getElementById(replyingMsgId)?.scrollIntoView({behavior: "smooth"})
    }

    ngOnInit() {
        this.smallAvatar = this.fileService.getURLContentFilePublic(this.domainDataService.avatarImg, this.domainDataService.realmName);
        this.historyAskDocumentService.getHistorySubscription().subscribe(res => {
            this.showHistory = !this.showHistory;
        })
    }

    isNewConversation(index: number, message: ChatMessageModel) {
        return ((message.type == this.messageType.END_CHAT && this.chatModel.chatState.chatHistory[index + 1] && this.chatModel.chatState.chatHistory[index + 1].type != this.messageType.SURVEY)
            || (message.type == this.messageType.SURVEY)) && this.chatModel.endChat == false;
    }

    onListScroll() {
        if (this.scrollRef) {
            setTimeout(() => {
                if (this.scrollRef.SimpleBar) {
                    this.scrollRef.SimpleBar.getScrollElement().scrollTop = this.scrollRef.SimpleBar.getScrollElement()?.scrollHeight ? this.scrollRef.SimpleBar.getScrollElement()?.scrollHeight : 1000;
                }
            }, 200);
        }
    }

    closeChatBox() {
        parent.postMessage('closeChatBox', '*');
        this.changeHeader.emit(this.chatModel);
    }

    getColorFromText(id: string) {
        return document.getElementById(id + 'reMsg')!.style.color
    }

    sendMessage() {
        let isSendingTextNotEmpty = this.chatModel.chatMessage.content.trim() != ''
        let isSendingFile = this.chatModel.chatMessage.files.originFiles.length > 0;
        if (isSendingFile) {
            this.chatModel.chatMessage.type = '-1';
            this.changeBody.emit(this.chatModel);
        } else if (isSendingTextNotEmpty) {
            this.chatModel.chatMessage.type = '1';

            if (this.hasSuggest && this.suggests.length > 0 && this.chatModel.chatMessage.messageId == '') {
                let index = this.suggests.findIndex((suggest: any) => suggest.question.toLowerCase() == this.chatModel.chatMessage.content.trim().toLowerCase())
                if (index >= 0) { // type question that are existed in suggests
                    this.chatModel.chatMessage.messageId = this.suggests[index].id
                    this.chatModel.chatMessage.content = this.suggests[index].question
                    this.sendMessage()
                } else {
                    this.changeBody.emit(this.chatModel);
                }
            } else {
                this.changeBody.emit(this.chatModel);
            }
        }

        if (this.isreplyMessage) {
            this.closeReplyBlock();
        }

        if (this.hasSuggest) {
            this.closeSuggestBlock(null);
        }

        this.resetCurrentMessage();
        this.onListScroll();
        this.submitChatSrc.next()
    }

    ngAfterViewInit() {
        let a = this.scrollRef.SimpleBar.getScrollElement()

        this.initIntersectionObserver(this.scrollRef.SimpleBar.getScrollElement())


        this.scrollSubscription = this.scrollToBottom?.subscribe(v => {
            this.onListScroll();
            this.resetCurrentMessage();
        })

        window.setTimeout(() => {
            this.onListScroll();
            this.gainFocusOnTextInput()
        }, 200)
        /*
            gửi typing khi có sự kiện thay đổi input lần đầu tiên (sau 20s nếu vẫn ở trạng thái typing, gửi tiếp bản tin typing)
            sau 5s ko gõ phím gì nữa gửi OFF typing
        */
        const inputChat$ = fromEvent(this.chatInputElement?.nativeElement, 'input').pipe(map((a: any) => a.target.value))
        const submitChat$ = this.submitChatSrc.asObservable().pipe(map(() => ''))
        this.typingSub = merge(inputChat$, submitChat$)
            .pipe(
                switchMap((a: any) => {
                    if (a) {
                        return concat(of('ON').pipe(delay(10)), of('OFF').pipe(delay(1000 * PROPERTIES.TypingTime)));
                    } else {
                        return of('OFF').pipe(delay(10));
                    }
                }),
                distinctUntilChanged(),
                switchMap((a) => {
                    if (a == 'ON') {
                        return concat(
                            ...[...Array(10).keys()].map((i) =>
                                of(true).pipe(delay(i * 20000))
                            )
                        );
                    } else {
                        return of(false);
                    }
                }),
            )
            .subscribe((x) => {
                this.typingSignal?.next(x)
            })
    }

    onChangeTextKeyDown(event: any) {
        this.chatModel.chatMessage.onlyEmoji = false;
        if (event.which === 13 && event.shiftKey) {
        } else if (event.which === 13) {
            this.sendMessage();
            event.preventDefault();
        }
    }

    getSuggest(event: any) {
        this.chatModel.chatMessage.onlyEmoji = false;
        if (event.which === 13 && event.shiftKey) {
        } else if (event.which === 13) {
        } else {
            let input = event.target.value.trim();
            this.asyncFunctionWithParams(input)
        }
    }

    recentText = "";

    asyncFunctionWithParams(input: string) {
        if (input && input.length > 1) {
            if (this.recentText == input) return;
            this.recentText = input;
            this.chatServerService.getSuggest(input, this.domainDataService.domainCode).subscribe(res => {
                if (res && res.length > 0) {
                    this.hasSuggest = true;
                    console.log('Showing suggests')
                    window.setTimeout(() => {
                        this.suggests = res;
                        this.suggestService.startShowSuggestion({"input": input, "data": res})
                    }, 100)
                } else {
                    this.hasSuggest = false;
                    console.log('No suggestions')
                }
            }, error => {
                this.hasSuggest = false
                console.log('No suggestions')
            })
        } else {
            this.hasSuggest = false;
            this.recentText = ''
        }
        return null;
    }


    resetCurrentMessage() {
        this.chatModel.chatMessage.messageId = ''
        this.chatModel.chatMessage.files = new FileObject();
        this.chatModel.chatMessage.type = '';
        this.hasSuggest = false;
        this.recentText = '';
        this.chatModel.chatMessage.isReplyMessage = false;
        this.chatModel.chatMessage.onlyEmoji = false;
        this.chatModel.chatMessage.replyFilesName = '';
        this.chatModel.chatMessage.replyUserType = -1;
        this.chatModel.chatMessage.replySendTime = -1;
        this.chatModel.chatMessage.replyMsg = '';
        this.chatModel.chatMessage.replyMsgId = '';
        this.chatModel.chatMessage.replyFiles = '';
        this.chatModel.chatMessage.replyType = -1;
    }

    replyMessage(event: any, message: any) {
        this.isreplyMessage = true;
        this.isreplyMessage = false;

        this.chatModel.chatMessage.replyMsgId = message.messageId;
        this.chatModel.chatMessage.replySendTime = message.sendTime;
        this.chatModel.chatMessage.replyUserType = message.userType;
        this.chatModel.chatMessage.isReplyMessage = this.isreplyMessage
        this.chatModel.chatMessage.replyType = message.type;
        this.chatModel.chatMessage.isReplyingAlbum = message.files.length > 1
        if (message.type != 1) {
            this.chatModel.chatMessage.replyFilesName = message.filesName[0];
            this.chatModel.chatMessage.replyFiles = this.fileService.getURLContentFilePublic(message.files[0], this.domainDataService.realmName);
        } else {
            this.chatModel.chatMessage.replyMsg = message.content;
        }
        this.gainFocusOnTextInput();
    }

    mouseLeave(event: any, className: string) {
        let elements = event.target.querySelectorAll(className);
        for (let element of elements) {
            element.style.visibility = 'hidden'
        }
    }


    mouseEnter(event: any, className: string) {
        let elements = event.target.querySelectorAll(className);
        for (let element of elements) {
            element.style.visibility = 'visible'
        }
    }

    mouseLeaveConfirm(event: any, className: string) {
        let elements = event.target.querySelectorAll(className);
        for (let element of elements) {
            element.style.visibility = 'hidden'
        }
    }

    mouseEnterConfirm(event: any, className: string) {
        let elements = event.target.querySelectorAll(className);
        for (let element of elements) {
            element.style.visibility = 'visible'
        }
    }

    confirm(docConfirmItem: DocumentItem) {
        this.chatModel.chatMessage.messageId = docConfirmItem.id;
        this.chatModel.chatMessage.content = docConfirmItem.question;
        this.sendMessage()
    }

    getResource(path: string) {
        return this.fileService.getURLContentFilePublic(path, this.domainDataService.realmName);
    }

    getResourceFromSafeUrl(safeUrlString: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(safeUrlString)
    }

    loadSurvey(surveyObject: any) {
        window.open(`${SERVICES.APP_IPCC_URL.url}/survey-response?realm=${surveyObject.realmName}&clientId=${surveyObject.clientId}`, 'blank');
    }

    downloadFile(status: number, fileName: string, pathValue: string) {
        if (status == 2 || status == 1) {
            this.fileDownloadSubscription = this.fileService.getContentFilePublic(pathValue, this.domainDataService.realmName).subscribe(result => {
                saveAs(result.body as Blob, fileName)
            }, error => {
                console.log("Failed to download file: " + fileName)
                console.log(error);
            })
        }
    }

    reSendMessage(message: ChatMessageModel) {
        /* should re-send message */
        message.status = this.messageStatus.SENDING
        window.setTimeout(() => {
            this.resend.emit(message)
        }, 1000)
    }

    getTruncateFileName(message: ChatMessageModel): string {
        let content = message.replyFilesName;
        if (!content) return "";
        let extension = content.substring(content.lastIndexOf("."));

        if (content.length > 42) {
            content = content.substring(0, 35) + ' ... ' + extension;
        }
        return content;
    }

    openReourceInbigView(urls: string[], type: number) {
        if (type == 8) {
            const image_window = window.open("", 'blank', 'width=1368px,height=1200px,resizable=1,menubar=no, top=200, left=300');
            image_window?.document.write(`
              <html>
                <head>
                </head>
                <body>
                  <img src=" ` + urls[0] + `" alt="Example" style="max-height="1000px" max-width="1000px"">
                </body>
              </html>
        `)
        } else if (type == 4) {
            const image_window = window.open("", 'blank', 'width=1368px,height=1200px,resizable=1');
            image_window?.document.write(`
              <html>
                <head>
                    <title>Video player</title>
                </head>
                <video controls max-width="1368px" max-height="1200px">
                  <source src=" ` + urls[0] + `">
                  Trinh duyet cua ban khong ho tro
                </video>
              </html>
              `);
        }

    }

    openReourceInbigViewUsingSafeUrl(safeUrl: SafeUrl, type: number) {
        if (type == 8) {
            const image_window = window.open("", 'blank', 'width=1368px,height=1200px,resizable=1,menubar=no, top=200, left=300');
            image_window?.document.write(`
              <html>
                <head>
                </head>
                <body>
                  <img src=" ` + safeUrl + `" alt="Example" style="max-height=1000px; max-width=1000px"">
                </body>
              </html>
        `)
        } else if (type == 4) {
            const image_window = window.open("", 'blank', 'width=1368px,height=1200px,resizable=1');
            image_window?.document.write(`
              <html>
                <head>
                    <title>Video player</title>
                </head>
                <video controls max-width="1368px" max-height="1200px">
                  <source src=" ` + safeUrl + `">
                  Trinh duyet cua ban khong ho tro
                </video>
              </html>
              `);
        }

    }

    onChangeToolbarFilesInput(objectDetail: ChatClientModel) {
        this.chatModel = objectDetail;
        this.sendMessage();
    }

    closeReplyBlock() {
        this.isreplyMessage = false;
        this.resetCurrentMessage();
    }

    closeSuggestBlock(data: any) {
        if (!data) {
            this.resetCurrentMessage();
        } else {
            if (data.id) {
                this.chatModel.chatMessage.messageId = data.id
                this.chatModel.chatMessage.content = data.question
                this.sendMessage()
            } else {
                this.chatModel.chatMessage.content = data.question + " "
                this.asyncFunctionWithParams(data.question)
            }
        }
    }

    closeHistyBlock(data: any) {
        if (data == null) {
            this.showHistory = false;
        } else {
            this.chatModel.chatMessage.content = data
            this.sendMessage()
            this.showHistory = false;
        }
    }

    isShowChatHistory(): boolean {
        return this.chatModel.chatState != null && this.chatModel.chatState.chatHistory != null
            && this.chatModel.chatState.chatHistory.length > 0
    }

    isLastMessageInSectionFromAgent(i: number) {
        let show;
        show = this.chatModel.chatState.chatHistory[i].userType == 2 && (this.chatModel.chatState.chatHistory[i + 1] == undefined || (this.chatModel.chatState.chatHistory[i + 1] != undefined && this.chatModel.chatState.chatHistory[i + 1].userType == 1));
        return show;
    }

    isNewDateInSectionFromAgent(i: number) {
        if (i == 0) return true
        else {
            let timeInLong = this.chatModel.chatState.chatHistory[i].sendTime;
            let timeInLongOfPreviousMessage = this.chatModel.chatState.chatHistory[i - 1].sendTime;
            return this.getDateFromLong(timeInLongOfPreviousMessage) != this.getDateFromLong(timeInLong);
        }
    }

    isFromClient(i: number) {
        return this.chatModel.chatState.chatHistory[i].userType == 1;
    }

    gainFocusOnTextInput() {
        let element = window.document.getElementById('box-chat-input');
        element?.focus();
    }

    getFileSize(fileSize: number) {
        if (fileSize < 1000) return '1 KB';
        return (fileSize < 1000000 ?
            (Math.round(fileSize / 1000) + ' KB') :
            (Math.round(fileSize / 1000000) + ' MB'))
    }

    isImageOrGifOrSticker(messageType: number) {
        return messageType == this.messageType.IMAGE || messageType == this.messageType.STICKER || messageType == this.messageType.GIF
    }

    isTextType(messageType: number) {
        return messageType == this.messageType.TEXT || messageType == this.messageType.WARNING_END || messageType == this.messageType.END_CHAT || messageType == this.messageType.MISS || messageType == this.messageType.BLOCKED_MSG
    }

    getMessageFromHistoryById(id: string): ChatMessageModel {
        return this.chatModel.chatState.chatHistory.find(i => i.messageId === id)!;
    }

    isReplyingAlbum(messageId: string): boolean {
        let message: ChatMessageModel | undefined = this.chatModel.chatState.chatHistory.find(chatMessage => chatMessage.messageId == messageId);
        if (message && message.filesName.length > 1) {
            return true;
        }
        return false;
    }

    truncateSurveyText(content: string) {
        let index = content.indexOf("http://");
        if (index < 0) index = content.indexOf("https://");

        if (index > 0) {
            return content.substring(0, index);
        } else return content;
    }
}

