import {Service} from "./service.model";

export class DomainModel {
    agentDesc: string;
    agentInfo: string;
    autoChat: boolean;
    borderRadius: number;
    botRealmId: number;
    botSiteType: number;
    channelId: number;
    chatBotSecretKey: string;
    chatBotSupport: number;
    chatBotUrl: string
    chatName: string;
    colorAgent: string;
    colorCust: string;
    createBy: string;
    createTime: number;
    domainName: string;
    domainThemeId: number;
    enableCustomerInfo: number;
    enableWarningEnd: number;
    groupId: number;
    language: string;
    messageOffline: string;
    messageOnline: string ;
    messageTitle: string;
    minimumTitle: string;
    offlineTitle: string;
    onlineTitle: string;
    realmId: number;
    surveyBussinessid: number;
    surveySend: number;
    surveyType: number;
    timeEndChat: number;
    timeWarningChat: number;
    updateBy: string;
    updateTime: number;
    domainId : number;
    domainCode : string ;
    description : string ;
    avatarImg: string;
    chatTitle: string;
    chatInfo : string ;
    color : string ;
    services: Service[] = [];


    constructor(
        agentDesc: string, agentInfo: string, autoChat: boolean, borderRadius: number, botRealmId: number,
        botSiteType: number, channelId: number, chatBotSecretKey: string, chatBotSupport: number, chatBotUrl: string,
        chatName: string, colorAgent: string, colorCust: string, createBy: string, createTime: number,
        domainName: string, domainThemeId: number, enableCustomerInfo: number, enableWarningEnd: number, groupId: number,
        language: string, messageOffline: string, messageOnline: string, messageTitle: string, minimumTitle: string,
        offlineTitle: string, onlineTitle: string, realmId: number, surveyBussinessid: number, surveySend: number,
        surveyType: number, timeEndChat: number, timeWarningChat: number, updateBy: string, updateTime: number,
        domainId: number, domainCode: string, description: string, avatarImg: string, chatTitle: string,
        chatInfo: string, color: string, services: Service[]) {
            this.agentDesc = agentDesc;
            this.agentInfo = agentInfo;
            this.autoChat = autoChat;
            this.borderRadius = borderRadius;
            this.botRealmId = botRealmId;
            this.botSiteType = botSiteType;
            this.channelId = channelId;
            this.chatBotSecretKey = chatBotSecretKey;
            this.chatBotSupport = chatBotSupport;
            this.chatBotUrl = chatBotUrl;
            this.chatName = chatName;
            this.colorAgent = colorAgent;
            this.colorCust = colorCust;
            this.createBy = createBy;
            this.createTime = createTime;
            this.domainName = domainName;
            this.domainThemeId = domainThemeId;
            this.enableCustomerInfo = enableCustomerInfo;
            this.enableWarningEnd = enableWarningEnd;
            this.groupId = groupId;
            this.language = language;
            this.messageOffline = messageOffline;
            this.messageOnline = messageOnline;
            this.messageTitle = messageTitle;
            this.minimumTitle = minimumTitle;
            this.offlineTitle = offlineTitle;
            this.onlineTitle = onlineTitle;
            this.realmId = realmId;
            this.surveyBussinessid = surveyBussinessid;
            this.surveySend = surveySend;
            this.surveyType = surveyType;
            this.timeEndChat = timeEndChat;
            this.timeWarningChat = timeWarningChat;
            this.updateBy = updateBy;
            this.updateTime = updateTime;
            this.domainId = domainId;
            this.domainCode = domainCode;
            this.description = description;
            this.avatarImg = avatarImg;
            this.chatTitle = chatTitle;
            this.chatInfo = chatInfo;
            this.color = color;
            this.services = services;
    }
}
