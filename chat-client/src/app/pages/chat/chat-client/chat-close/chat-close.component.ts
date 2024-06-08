import {Component, Injector, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ChatUtil} from "../../../../shared/services/chat-client/chat.util.services";
import {UserProfileService} from "../../../../core/services/user-data.service";
import {DomainDataService} from "../../../../core/services/domain-data.service";
import {ChatDomainService} from "../../../../shared/services/chat-client/chat.domain.service";
import {LanguageService} from "../../../../core/services/language.service";
import {TranslateService} from "@ngx-translate/core";
import {FileService} from "../../../../shared/services/chat-client/file.service";
import {Service} from "../../../../shared/models/chat-client/service.model";
import {Subscription} from "rxjs";

@Component({
    selector: 'chat-close',
    templateUrl: './chat-close.component.html',
    styleUrls: ['./chat-close.component.css']
})

export class ChatCloseComponent implements OnInit, OnDestroy {
    private domainEncoded = '';
    private externalId = '';
    private realm = '';
    private userCode = '';
    protected router: Router | undefined;
    protected activatedRoute: ActivatedRoute | undefined;
    protected calendarWebChannel = 5;
    domainDataService: DomainDataService;
    protected fileService: FileService;
    /* This variable is for showing small icon or not, if chat-service die, or no connection to it, then do not show small icon */
    showIcon = true;
    reCheckCalendar = false;

    /* This variable is for knowing if user is reloading or just navigating into this component */
    reload = true;
    smallAvatar: string = '';

    private WORKING_TYPE = {
        IN_TIME: 1,
        OUT_TIME: 2
    }

    private domainSubscription: Subscription | undefined;
    private domainDetailSubscription: Subscription | undefined;

    constructor(injector: Injector, private userDataService: UserProfileService,
                private chatDomainService: ChatDomainService,
                private langService: LanguageService, private trans: TranslateService,
                private translateService: TranslateService) {
        this.router = injector.get(Router);
        this.activatedRoute = injector.get(ActivatedRoute);
        this.domainDataService = injector.get(DomainDataService)
        this.fileService = injector.get(FileService)
    }

    ngOnDestroy() {
        this.domainSubscription?.unsubscribe();
        this.domainDetailSubscription?.unsubscribe();
    }

    async ngOnInit() {
        this.smallAvatar =  '.\\assets\\images\\plan.png';
        const key = this.activatedRoute!.snapshot!.paramMap.get('domain')!;
        let listParams = '';

        listParams = atob(decodeURIComponent(key))
        this.domainEncoded = ChatUtil.newNvl(ChatUtil.getParameterByName('domain', listParams), '')
        this.externalId = ChatUtil.newNvl(ChatUtil.getParameterByName('externalId', listParams), '')
        this.realm = ChatUtil.newNvl(ChatUtil.getParameterByName('realm', listParams), '')


        this.domainDataService.domainCode = this.domainEncoded
        // parent.postMessage('openChatBox', '*');
        // this.router!.navigate(['/chat-client/' + this.domainEncoded]);

        let openChatVar = localStorage.getItem('open-chat');
        let openedChat = openChatVar && openChatVar == 'true'
        if (openedChat) {
            parent.postMessage('openChatBox', '*');
            this.router!.navigate(['/chat-client/' + this.domainEncoded]);
        }
        // if (this.reload) {
        //     if (this.domainDataService.autoChat == 1) {
        //         parent.postMessage('openChatBox', '*');
        //         this.router!.navigate(['/chat-client/' + this.domainEncoded]);
        //     } else {
        //         if (openedChat) {
        //             parent.postMessage('openChatBox', '*');
        //             this.router!.navigate(['/chat-client/' + this.domainEncoded]);
        //         }
        //     }
        // }

        // try {
        //     listParams = atob(decodeURIComponent(key))
        //     this.domainEncoded = ChatUtil.newNvl(ChatUtil.getParameterByName('domain', listParams), '')
        //     this.externalId = ChatUtil.newNvl(ChatUtil.getParameterByName('externalId', listParams), '')
        //     this.realm = ChatUtil.newNvl(ChatUtil.getParameterByName('realm', listParams), '')
        //     this.userCode = ChatUtil.newNvl(ChatUtil.getParameterByName('userCode', listParams), '')
        //     this.userDataService.externalId = this.externalId;
        //     this.userDataService.userCode = this.userCode;
        //     this.domainDataService.realmName = this.realm;
        //
        //     this.initData(this.domainEncoded);
        // } catch (error) {
        //     /* Case of redirect from chat-client component then can not extract domain code from url */
        //     console.error("Can not extract domain_code from url")
        //     this.domainEncoded = key.substring(0, key.indexOf("?"));
        //
        //     listParams = decodeURIComponent(key);
        //     this.externalId = ChatUtil.newNvl(ChatUtil.getParameterByName('externalId', listParams), '')
        //     this.realm = ChatUtil.newNvl(ChatUtil.getParameterByName('realm', listParams), '')
        //     this.userCode = ChatUtil.newNvl(ChatUtil.getParameterByName('userCode', listParams), '')
        //     this.userDataService.externalId = this.externalId;
        //     this.userDataService.userCode = this.userCode;
        //     this.domainDataService.realmName = this.realm;
        //
        //     this.reload = false;
        //     this.domainDataService.showService = false;
        //
        //     /* lấy lại service ID đã chọn mỗi khi reload trang, đã được lưu tại local-storage thông qua chat-client.component.ts : func onChangeService */
        //     this.userDataService.serviceId = this.domainDataService.serviceId;
        //
        //     this.initData(this.domainEncoded);
        //     console.log('Get domain info from local done!')
        // }
    }

    protected saveCustomerInfoToStorage() {
        localStorage.setItem('customerInfo_' + this.domainDataService.domainId, JSON.stringify(this.userDataService.getDataClient()));
    }

    saveDomainDataToLocalAndOpenChat() {
        this.saveDomainToLocalStorage(this.domainDataService)

        /* autoChat là giá trị truyền từ chat-client khi click vào nút thu gọn của sổ chat, nếu ở Th này, sẽ không sử
         dụng giá trị auto-chat của domain để mở cửa sổ chat, Nếu auto-chat == 1: thì vẫn phải close chat, do hành vi của người dùng muốn close. */

        /*
        * this.reload = false chỉ khi đã thực hiện chat sau đó navigate về màn hình thu nhỏ (mời chat)
        * autoChat = 1 => load sẵn của sổ chat khi KH truy cập vào trang web lần đầu, ngược lại không mở nếu auto-chat = 0
        * Còn từ lần tiếp theo reload, nếu chưa từng mở cửa sổ chat lên ( auto-chat = 0) thì vẫn đóng cửa sổ chat,
        * nếu đã từng mở lên cửa sổ chat thì sẽ luôn mở sẵn cửa sổ chat ngay cả khi (auto-Chat-0)
        * */
        let openChatVar = localStorage.getItem('open-chat');
        let openedChat = openChatVar && openChatVar == 'true'
        if (this.reload) {
            if (this.domainDataService.autoChat == 1) {
                parent.postMessage('openChatBox', '*');
                this.router!.navigate(['/chat-client/' + this.domainEncoded]);
            } else {
                if (openedChat) {
                    parent.postMessage('openChatBox', '*');
                    this.router!.navigate(['/chat-client/' + this.domainEncoded]);
                }
            }
        }
    }

    compareLocalDateWithReloadData(): number {
        let same = 1;
        let change = 0;
        let domainInLocal = localStorage.getItem("domain_info_" + this.domainEncoded)
        let customerInfoInLocal = localStorage.getItem('customerInfo_' + this.domainDataService.domainId)

        let newAllowUserName = this.domainDataService.domainDetail.allowInfo;
        let newAllowUserEmail = this.domainDataService.domainDetail.allowEmail;
        let newAllowUserPhone = this.domainDataService.domainDetail.allowMobile;
        let newAllowUserMessage = this.domainDataService.domainDetail.allowMessage;

        if (!domainInLocal || !customerInfoInLocal) {
            if (this.domainDataService.services.length > 1) {
                return change;
            }

            if (this.domainDataService.enableCustomerInfo == 1) {
                if (newAllowUserName == 1 || newAllowUserEmail == 1 || newAllowUserPhone == 1 || newAllowUserMessage == 1) {
                    return change;
                }
            }
            return same;
        }

        let saveDomainData = JSON.parse(domainInLocal);
        let saveCustomerInfo = JSON.parse(customerInfoInLocal);

        /* check services changes */
        let oldServiceLength = saveDomainData.services.length;

        /*
         Need edit: check case One service and no input user data => do not show chat-service component and lazy init user.
        */
        if (this.domainDataService.services.length == 1 && this.domainDataService.enableCustomerInfo == 0)
            return same;

        if (oldServiceLength != this.domainDataService.services.length) {
            // console.log("Number of service changed, show user form")
            return change;
        } else {
            let oldServiceId = saveCustomerInfo.serviceId;
            let oldServiceIndex = this.domainDataService.services.findIndex(serv => serv.serviceId == oldServiceId);
            if (oldServiceIndex < 0) {
                // console.log("Old selected service does not appear in new service list, show user form")
                return change;
            } else {
                /* Set lại old serviceId for chat-session */
                this.domainDataService.service = this.domainDataService.services[oldServiceIndex];
                this.domainDataService.serviceId = oldServiceId;
                this.userDataService.serviceId = oldServiceId;
                this.userDataService.serviceCode = this.domainDataService.service.serviceCode;
            }
        }

        /* check allow user information fields*/
        let oldEnableCustomerInfo = saveDomainData.enableCustomerInfo;
        if (oldEnableCustomerInfo != this.domainDataService.enableCustomerInfo) {
            // console.log("New value of EnableCustomerInfo, show user form")
            return change;
        } else {
            if (this.domainDataService.enableCustomerInfo == 1) {
                let oldAllowUserName = saveDomainData.domainDetail.allowInfo;
                let oldAllowUserEmail = saveDomainData.domainDetail.allowEmail;
                let oldAllowUserPhone = saveDomainData.domainDetail.allowMobile;
                let oldAllowUserMessage = saveDomainData.domainDetail.allowMessage;

                let countEnableField = 0
                if (oldAllowUserName != newAllowUserName) {
                    if (newAllowUserName == 1) {
                        // console.log("Change value of allow user Name, old: " + oldAllowUserName + " new:" + newAllowUserName + ", show user form")
                        countEnableField++;
                    }
                }
                if (oldAllowUserEmail != newAllowUserEmail) {
                    if (newAllowUserEmail == 1) {
                        // console.log("Change value of allow user Email, old: " + oldAllowUserEmail + " new:" + newAllowUserEmail + ", show user form")
                        countEnableField++;
                    }
                }
                if (oldAllowUserPhone != newAllowUserPhone) {
                    if (newAllowUserPhone == 1) {
                        // console.log("Change value of allow user Phone, old: " + oldAllowUserPhone + " new:" + newAllowUserPhone + ", show user form")
                        countEnableField++;
                    }
                }
                if (oldAllowUserMessage != newAllowUserMessage) {
                    if (newAllowUserMessage == 1) {
                        // console.log("Change value of allow user Message, old: " + oldAllowUserMessage + " new:" + newAllowUserMessage + ", show user form")
                        countEnableField++;
                    }
                }

                if (countEnableField > 0) {
                    return change;
                }

                let newRequireUserName = this.domainDataService.domainDetail.requireInfo;
                let newRequireUserEmail = this.domainDataService.domainDetail.requireEmail;
                let newRequireUserPhone = this.domainDataService.domainDetail.requireMobile;
                let newRequireUserMessage = this.domainDataService.domainDetail.requireMessage;

                let oldUserNameData = saveCustomerInfo.name.trim();
                let oldUserEmailData = saveCustomerInfo.email.trim();
                let oldUserPhoneData = saveCustomerInfo.phone.trim();
                let oldUserMessageData = saveCustomerInfo.message.trim();

                if (newAllowUserName == 1 && newRequireUserName == 1 && !oldUserNameData) {
                    // console.log("Change value of require user Name, " + " require Name :" + newRequireUserName + ", old Name data: " + oldUserNameData + ", show user form")
                    return change;
                }
                if (newAllowUserEmail == 1 && newRequireUserEmail == 1 && !oldUserEmailData) {
                    // console.log("Change value of require user Email, " + " require Email :" + newRequireUserEmail + ", old Email data: " + oldUserEmailData + ", show user form")
                    return change;
                }
                if (newAllowUserPhone == 1 && newRequireUserPhone == 1 && !oldUserPhoneData) {
                    // console.log("Change value of require user Phone, " + " require Phone :" + newRequireUserPhone + ", old Phone data: " + oldUserPhoneData + ", show user form")
                    return change;
                }
                if (newAllowUserMessage == 1 && newRequireUserMessage == 1 && !oldUserMessageData) {
                    // console.log("Change value of require user Message, " + " require Message :" + newRequireUserMessage + ", old Message data: " + oldUserMessageData + ", show user form")
                    return change;
                }
            }
        }
        // console.log("No changes from user config, hide user form")
        return same;
    }

    img404(img: any) {
        img.onerror = "";
        img.src = '/assets/images/users/avatar-2.jpg';
        return true;
    }

    initData(domainCode: string) {
        // Not save because initial user data is empty
        // this.saveCustomerInfoToStorage();

        /* get domain config */
        let savedLocalData = JSON.parse(localStorage.getItem("domain_info_" + this.domainEncoded)!);
        if (savedLocalData) {
            this.domainDataService.saveData(savedLocalData);
        }
        this.getDomainConfig(domainCode);
    }

    private checkShowService() {
        /* check show service or not */
        if (this.domainDataService.workingTimeType == this.WORKING_TYPE.IN_TIME) {
            this.domainDataService.showService = this.compareLocalDateWithReloadData() == 0;  // 1: same, 0: changed
        } else {
            let localChat = localStorage.getItem('chatState_' + this.domainDataService?.domainId)
            if (localChat) {
                let messageList = JSON.parse(localChat).chatHistory
                if (messageList.length > 1) {
                    let lastMessage = messageList[messageList.length - 1]
                    if (new Date().getTime() - lastMessage.sendTime > 0) {
                        this.domainDataService.showService = false;
                    } else {
                        this.domainDataService.showService = true;
                    }
                } else {
                    this.domainDataService.showService = true;
                }
            } else {
                this.domainDataService.showService = true;
            }
        }
        console.log("Show service: " + this.domainDataService.showService + ", working type: " + this.domainDataService.workingTimeType)
    }

    setMinorDomainData(chooseService: Service) {
        this.domainDataService.authorName = this.domainDataService.chatTitle
        this.domainDataService.service = chooseService;
    }

    setMinorUserDataService(chooseService: Service) {
        this.userDataService.serviceId = chooseService.serviceId;
        this.userDataService.serviceCode = chooseService.serviceCode;
    }

    setLanguageByDomainLanguage(language: string) {
        this.langService.setLanguage(language)
    }

    setAvatarPathForSmallIcon(avatarPath: string, realmName: string) {
        this.smallAvatar = this.fileService.getURLContentFilePublic(avatarPath, realmName);
    }

    getDomainConfig(domainCode: string) {

        this.domainSubscription = this.chatDomainService?.getDomain(domainCode).subscribe(rs => {
            this.showIcon = true;
            if (!rs.data || !rs.data.listData[0]) {
                this.domainDataService.minimumTitle = this.trans.instant('chat.error.invalid-domain')
                this.domainDataService.status = 0;
                return
            }

            let domainData = rs.data.listData[0];

            let firstService: Service | undefined;
            if (this.domainDataService.serviceId && this.domainDataService.serviceId != '') {
                firstService = domainData.services.find((service: any) => service.serviceId == this.domainDataService.serviceId)
                if (!firstService) {
                    firstService = domainData.services[0];
                }
            } else {
                firstService = domainData.services[0];
            }

            this.domainDataService.saveData(domainData);
            this.setAvatarPathForSmallIcon(this.domainDataService.avatarImg, this.domainDataService.realmName)

            if (firstService == undefined) {
                this.domainDataService.minimumTitle = this.translateService.instant("chat.no-service")
                this.domainDataService.status = 0;
            }

            this.setMinorDomainData(firstService!);
            this.setMinorUserDataService(firstService!);
            this.setLanguageByDomainLanguage(this.domainDataService.language)
            // this.saveCustomerInfoToStorage();
            this.loadRestOfData(domainCode, this.userDataService.serviceId);
        }, error => {
            console.log(error);
            let savedLocalData = JSON.parse(localStorage.getItem("domain_info_" + this.domainEncoded)!);
            if (savedLocalData) {
                this.domainDataService.saveData(savedLocalData);
            }

            let openedChat = localStorage.getItem('open-chat') == 'true';
            if (openedChat) {
                this.showIcon = false;
            }

            /* compare */
            this.setAvatarPathForSmallIcon(this.domainDataService.avatarImg, this.domainDataService.realmName)
            this.setLanguageByDomainLanguage(this.domainDataService.language)
            this.checkShowService();
            /* lấy lại service ID đã chọn mỗi khi reload trang, đã được lưu tại local-storage thông qua chat-client.component.ts : func onChangeService */
            this.setMinorUserDataService(this.domainDataService.service!);
            // this.saveCustomerInfoToStorage();
            this.saveDomainDataToLocalAndOpenChat()
            console.log('Get domain info from local done!')
        });
    }

    loadRestOfData(domainCode: string, serviceId: string) {
        let observable = this.chatDomainService.getDomainDataAndCalendarAndMessageDefaultAndDomainDetail(domainCode, serviceId);
        this.domainDetailSubscription = observable.subscribe(result => {
            this.showIcon = true;
            let data = JSON.parse(JSON.stringify(result))

            let workingTimeType = data.data['WORKING_TIME_TYPE'];
            let backgroundUrl = data.data['BACKGROUND_URL'];
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

            /* compare */
            // this.setAvatarPathForSmallIcon(this.domainDataService.avatarImg, this.domainDataService.realmName)
            // this.setLanguageByDomainLanguage(this.domainDataService.language)
            if (backgroundUrl) {
                this.domainDataService.domainThemeUrl = backgroundUrl;
            } else {
                this.domainDataService.domainThemeUrl = ""
            }
            this.checkShowService();

            this.saveDomainDataToLocalAndOpenChat()
        }, error => {
            console.log(error)
            console.log("Error when loading domain and calendar and messages from chat-service: loadRestOfData");
            let openedChat = localStorage.getItem('open-chat') == 'true';
            if (openedChat) {
                this.showIcon = false;
            }

            this.checkShowService();
            this.saveDomainDataToLocalAndOpenChat()
        })
    }

    saveDomainToLocalStorage(data: DomainDataService) {
        localStorage.setItem("domain_info_" + this.domainDataService.domainCode, JSON.stringify(data));
    }

    openChatBox() {
        // if (this.domainDataService.status == 0 || !this.userDataService.serviceId) return;
        parent.postMessage('openChatBox', '*');
        this.router!.navigate(['/chat-client/' + this.domainEncoded]);
    }
}