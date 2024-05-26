import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ChatClientModel} from '../../../../shared/models/chat-client/chat-client.model';
import {DomainDataService} from "../../../../core/services/domain-data.service";
import {ChatDomainService} from "../../../../shared/services/chat-client/chat.domain.service";
import {UserProfileService} from "../../../../core/services/user-data.service";
import {Service} from "../../../../shared/models/chat-client/service.model";
import {DomainDataEventService} from "../../../../core/services/domain-data-event.service";
import {Subscription} from "rxjs";


@Component({
    selector: 'app-chat-service',
    templateUrl: './chat-service.component.html',
    styleUrls: ['../chat-client.component.scss', './chat-service.component.scss']
})

export class ChatServiceComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() chatModel: ChatClientModel = new ChatClientModel();
    @Output() changeModel = new EventEmitter<ChatClientModel>();
    submit!: boolean;
    private chatServerConnectionSubscription: Subscription | undefined;

    showWarningNameEmpty = false;
    showWarningNameRegex = false;
    showWarningNameLength = false;

    showWarningEmailEmpty = false;
    showWarningEmailRegex = false;
    showWarningEmailLength = false;

    showWarningMessage = false;
    showWarningMessageLength = false;

    showWarningPhoneEmpty = false;
    showWarningPhoneRegex = false;
    showWarningPhoneLength = false;
    onlineGreetingOnUserForm = '';
    domainCode = '';
    selectedService: Service;

    public WORKING_TYPE = {
        IN_TIME: 1,
        OUT_TIME: 2
    }

    limitPhoneLength = 20;
    limitEmailLength = 100;
    limitNameLength = 100;
    calendarWebChannel = 5;

    public connectStatus = {
        SUCCESS: "success",
        FAILED: "failed",
        ERROR: "error"
    }

    private messageStatus = {
        FAILED: 0,
        SENT: 1,
        SEEN: 2,
        SENDING: 3
    }

    constructor(public userDataService: UserProfileService, public domainDataService: DomainDataService
        , public domainDataEventService: DomainDataEventService,
                private chatDomainService: ChatDomainService, private userProfileService: UserProfileService) {
        this.selectedService = this.domainDataService.service
    }

    ngAfterViewInit(): void {
        let savedCustomerInfo = localStorage.getItem('customerInfo_' + this.domainDataService.domainId);
        this.userProfileService.saveDataClient(JSON.parse(savedCustomerInfo!))
    }

    ngOnDestroy(): void {
        this.chatServerConnectionSubscription?.unsubscribe();
    }

    ngOnInit() {
        let greet = this.domainDataService.domainMessageDefault.content;
        this.onlineGreetingOnUserForm = greet ? greet : ''
        this.focusMessageField();
    }

    focusMessageField() {
        window.setTimeout(() => {
            let element = document.getElementById("message");
            element?.focus();
        }, 200)
    }

    onSubmit() {
        let isIntimeWorking = this.domainDataService.workingTimeType == this.WORKING_TYPE.IN_TIME
        let enableUserInfo = this.domainDataService.enableCustomerInfo == 1;
        if (enableUserInfo) {
            if (this.domainDataService.domainDetail.allowInfo) {
                if (this.domainDataService.domainDetail.requireInfo) {
                    this.changeUserName();
                }

                if (this.userDataService.name != '') {
                    this.changeUserName();
                }

            }

            if (this.domainDataService.domainDetail.allowMessage || !isIntimeWorking) {
                if (this.domainDataService.domainDetail.requireMessage) {
                    this.changeUserMessage();
                }

                if (this.userDataService.message != '' || !isIntimeWorking) {
                    this.changeUserMessage();
                }

            }

            if (this.domainDataService.domainDetail.allowEmail) {
                if (this.domainDataService.domainDetail.requireEmail) {
                    this.changeUserEmail();
                }

                if (this.userDataService.email != '') {
                    this.changeUserEmail();
                }

            }

            if (this.domainDataService.domainDetail.allowMobile) {
                if (this.domainDataService.domainDetail.requireMobile) {
                    this.changeUserPhone();
                }

                if (this.userDataService.phone != '') {
                    this.changeUserPhone();
                }

            }
        }

        if (!this.showWarningNameEmpty
            && !this.showWarningNameRegex
            && !this.showWarningNameLength
            && !this.showWarningEmailEmpty
            && !this.showWarningEmailRegex
            && !this.showWarningEmailLength
            && !this.showWarningMessage
            && !this.showWarningPhoneEmpty
            && !this.showWarningPhoneRegex
            && !this.showWarningPhoneLength) {

            this.readyToChat();
        }
    }

    readyToChat() {
        // this.domainDataService.workingTimeType = this.WORKING_TYPE.IN_TIME
        this.chatModel.showService = false;
        this.chatServerConnectionSubscription?.unsubscribe();
        this.changeModel.emit(this.chatModel);
    }

    showSelectService(): boolean {
        return this.domainDataService != null && this.domainDataService.services.length > 1;
    }

    validSubmit() {
        this.submit = true;
    }

    getTimeNowInLong() {
        return new Date().getTime();
    }

    protected saveChatStateToStorage() {
        localStorage.setItem('chatState_' + this.domainDataService?.domainId, JSON.stringify(this.chatModel.chatState));
    }

    changeService() {
        console.log("Selected service: " + this.userDataService.serviceId);
        console.log("Domain config starting-----------------------------------------------------------------")
        this.domainDataService.service = this.selectedService;
        this.domainDataService.serviceId = this.selectedService.serviceId;
        this.userDataService.serviceId = this.selectedService.serviceId;
        this.userDataService.serviceCode = this.selectedService.serviceCode;
        this.loadRestOfData(this.domainDataService.domainCode, this.userDataService.serviceId);
    }

    loadRestOfData(domainCode: string, serviceId: string) {
        let observable = this.chatDomainService.getDomainDataAndCalendarAndMessageDefaultAndDomainDetail(domainCode, serviceId);
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
            this.domainDataService.showService = true;
            console.log("working type: " + this.domainDataService.workingTimeType)
            this.saveDomainDataToLocalAndOpenChat()
        })
    }

    saveDomainDataToLocalAndOpenChat() {
        console.log("Re-saved domain data to local in chat-service!")
        localStorage.setItem("domain_info_" + this.domainDataService.domainCode, JSON.stringify(this.domainDataService));
    }

    // khong duoc chua cac ky tu: !@#$%^&*()<>?"/*-+[]{}`~:.  trong chuoi ten thi pass
    nameRegex = "^[^(!@#$%^&*()<>?\"/*\\-+\\[\\]{}`,~:;'=.)]+$"

    changeUserName() {
        let content = this.userDataService.name.trim();
        if (this.domainDataService.domainDetail.requireInfo == 1) {
            this.showWarningNameEmpty = content == '';
            this.showWarningNameRegex = !content.match(this.nameRegex);
        } else {
            this.showWarningNameRegex = false;
            if (content) {
                this.showWarningNameRegex = !content.match(this.nameRegex);
            }
        }

        if (this.showWarningNameEmpty) {
            this.showWarningNameRegex = false;
            return;
        }

        this.showWarningNameLength = content.length > this.limitNameLength;
        if (this.showWarningNameLength) {
            this.showWarningNameRegex = false;
            return;
        }
    }

    emailRegex = "^([^1-9])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"

    changeUserEmail() {
        let content = this.userDataService.email.trim();
        if (this.domainDataService.domainDetail.requireEmail == 1) {
            this.showWarningEmailEmpty = content == ''
            this.showWarningEmailRegex = !content.match(this.emailRegex);
        } else {
            this.showWarningEmailRegex = false;
            if (content) {
                this.showWarningEmailRegex = !content.match(this.emailRegex);
            }
        }
        if (this.showWarningEmailEmpty) {
            this.showWarningEmailRegex = false;
            return;
        }

        this.showWarningEmailLength = content.length > this.limitEmailLength;
        if (this.showWarningEmailLength) {
            this.showWarningEmailRegex = false;
        }
    }

    onFocusEmailIn() {
        this.showWarningEmailEmpty = false;
        this.showWarningEmailRegex = false;
        this.showWarningEmailLength = false;
    }

    onFocusNameIn() {
        this.showWarningNameEmpty = false;
        this.showWarningNameRegex = false;
        this.showWarningNameLength = false;
    }

    onFocusPhoneIn() {
        this.showWarningPhoneEmpty = false;
        this.showWarningPhoneRegex = false;
        this.showWarningPhoneLength = false;
    }

    onFocusContentIn() {
        this.showWarningMessageLength = false;
    }

    changeUserMessage() {
        let content = this.userDataService.message.trim();
        if (this.domainDataService.workingTimeType == 1) {
            this.showWarningMessage = content == '' && this.domainDataService.domainDetail.requireMessage == 1
        } else {
            /* always check empty when workingType == 0 */
            this.showWarningMessage = content == ''
        }

        if (this.showWarningMessage) {
            this.showWarningMessageLength = false;
            return
        }
    }

    phoneRegex = "^[0-9]+$"

    changeUserPhone() {
        this.showWarningPhoneRegex = false;
        this.showWarningPhoneLength = false;
        this.showWarningPhoneEmpty = false;

        let content = this.userDataService.phone.trim();

        if (this.domainDataService.domainDetail.requireMobile == 1) {
            this.showWarningPhoneEmpty = content == ''
            this.showWarningPhoneRegex = !content.match(this.phoneRegex);
        } else {
            if (content) {
                this.showWarningPhoneRegex = !content.match(this.phoneRegex);
            }
        }

        if (this.showWarningPhoneEmpty) {
            this.showWarningPhoneRegex = false;
            return;
        }

        this.showWarningPhoneLength = content.length > this.limitPhoneLength;
        if (this.showWarningPhoneLength) {
            this.showWarningPhoneRegex = false;
            return
        }
    }
}

