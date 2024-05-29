import {Injectable} from "@angular/core";
import {Service} from "../../shared/models/chat-client/service.model";
import {CalendarDetailModel} from "../../shared/models/chat-client/calendar-detail.model";
import {DomainDetailModel} from "../../shared/models/chat-client/domain-detail.model";
import {DomainMessageDefaultModel} from "../../shared/models/chat-client/domain-message-default";
import {KpiConfigParamModel} from "../../shared/models/chat-client/kpi-config-param.model";
import {Subject} from "rxjs";

@Injectable()
export class DomainDataService {
    authorName = 'Agent'
    agentDesc = '';
    agentInfo = '';
    autoChat = -1;
    status = -1;
    borderRadius = -1;
    botRealmId = -1;
    botSiteType = -1;
    channelId = -1;
    chatBotSecretKey = '';
    chatBotSupport = -1;
    chatBotUrl = '';
    chatName = '';
    colorAgent = '';
    colorCust = '';
    createBy = '';
    createTime = -1;
    domainName = '';
    domainThemeId = -1;
    enableCustomerInfo = -1;
    enableWarningEnd = -1;
    groupId = -1;
    language = '';
    messageOffline = '';  // first message when enter chat
    messageOnline = '';
    messageTitle = '';
    minimumTitle = '';
    offlineTitle = '';
    onlineTitle = '';
    realmId = -1;
    realmName = '';
    surveyBussinessid = -1;
    surveySend = -1;
    surveyType = -1;
    timeEndChat = -1;
    timeWarningChat = -1;
    updateBy = '';
    updateTime = -1;
    domainId = '';
    domainCode = 'SAMPLE';
    description = '';
    avatarImg = '';
    chatTitle = 'FAQ BOT';
    chatInfo = 'I am ready to help';
    color = '';
    showService = true;
    hasSurvey = false;
    serviceId = '';
    service: Service = new Service();
    sourceId: string = '';
    services: Service[] = [];
    domainThemeUrl= '';
    configParams: Map<string, KpiConfigParamModel> = new Map<string, KpiConfigParamModel>()
    surveyConfig: Map<string, any> = new Map<string, any>()

    workingDayDetail: CalendarDetailModel = new CalendarDetailModel();  // calendar detail
    domainDetail: DomainDetailModel = new DomainDetailModel();
    domainMessageDefault: DomainMessageDefaultModel = new DomainMessageDefaultModel();
    workingTimeType = 1; // 1 trong giờ làm việc, 2: ngoài giờ làm việc

    saveData(data: any) {
        if(data.showService != undefined){
            this.showService = data.showService
        }
        if(data.hasSurvey != undefined){
            this.hasSurvey = data.hasSurvey
        }
        if(data.realmName){
            this.realmName = data.realmName
        }
        if(data.authorName){
            this.authorName = data.authorName
        }

        if(data.service){
            this.service = data.service
        }

        if(data.agentDesc){
            this.agentDesc = data.agentDesc
        }
        if(data.agentInfo){
            this.agentInfo = data.agentInfo
        }
        if(data.chatBotSecretKey){
            this.chatBotSecretKey = data.chatBotSecretKey
        }
        if(data.chatBotUrl){
            this.chatBotUrl = data.chatBotUrl
        }
        if(data.chatName){
            this.chatName = data.chatName
        }
        if(data.colorAgent){
            this.colorAgent = data.colorAgent
        }
        if(data.colorCust){
            this.colorCust = data.colorCust
        }
        if(data.createBy){
            this.createBy = data.createBy
        }
        if(data.domainName){
            this.domainName = data.domainName
        }
        if(data.language){
            this.language = data.language
        }
        if(data.messageOffline){
            this.messageOffline = data.messageOffline
        }
        if(data.messageOnline){
            this.messageOnline = data.messageOnline
        }
        if(data.messageTitle){
            this.messageTitle = data.messageTitle
        }
        if(data.minimumTitle){
            this.minimumTitle = data.minimumTitle
        }
        if(data.offlineTitle){
            this.offlineTitle = data.offlineTitle
        }
        if(data.onlineTitle){
            this.onlineTitle = data.onlineTitle
        }
        if(data.updateBy){
            this.updateBy = data.updateBy
        }
        if(data.domainCode){
            this.domainCode = data.domainCode
        }
        if(data.description){
            this.description = data.description
        }
        if(data.avatarImg){
            this.avatarImg = data.avatarImg
        }
        if(data.chatTitle){
            this.chatTitle = data.chatTitle
        }
        if(data.chatInfo){
            this.chatInfo = data.chatInfo
        }
        if(data.color){
            this.color = data.color
        }

        if(data.borderRadius >= 0){
            this.borderRadius = data.borderRadius;
        }
        if(data.botRealmId >= 0){
            this.botRealmId = data.botRealmId;
        }
        if(data.botSiteType >= 0){
            this.botSiteType = data.botSiteType;
        }
        if(data.channelId >= 0){
            this.channelId = data.channelId;
        }
        if(data.chatBotSupport >= 0){
            this.chatBotSupport = data.chatBotSupport;
        }
        if(data.createTime >= 0){
            this.createTime = data.createTime;
        }
        if(data.domainThemeId >= 0){
            this.domainThemeId = data.domainThemeId;
        }
        if(data.enableCustomerInfo >= 0){
            this.enableCustomerInfo = data.enableCustomerInfo;
        }
        if(data.enableWarningEnd >= 0){
            this.enableWarningEnd = data.enableWarningEnd;
        }
        if(data.groupId >= 0){
            this.groupId = data.groupId;
        }
        if(data.realmId >= 0){
            this.realmId = data.realmId;
        }
        if(data.surveyBussinessid >= 0){
            this.surveyBussinessid = data.surveyBussinessid;
        }
        if(data.surveySend >= 0){
            this.surveySend = data.surveySend;
        }
        if(data.surveyType >= 0){
            this.surveyType = data.surveyType;
        }
        if(data.timeEndChat >= 0){
            this.timeEndChat = data.timeEndChat;
        }
        if(data.timeWarningChat >= 0){
            this.timeWarningChat = data.timeWarningChat;
        }
        if(data.updateTime >= 0){
            this.updateTime = data.updateTime;
        }
        if(data.domainId){
            this.domainId = data.domainId;
        }
        if(data.serviceId){
            this.serviceId = data.serviceId;
        }
        if(data.sourceId){
            this.sourceId = data.sourceId;
        }
        if(data.domainThemeUrl){
            this.domainThemeUrl = data.domainThemeUrl;
        }

        if(data.autoChat >= 0) {
            this.autoChat = data.autoChat;
        }

        if(data.status >= 0) {
            this.status = data.status;
        }
        if(data.services) {
            this.services = data.services;
        }

        if(data.configParams) {
            this.configParams = data.configParams;
        }
        if(data.surveyConfig) {
            this.surveyConfig = data.surveyConfig;
        }
        if(data.workingDayDetail) {
            this.workingDayDetail = data.workingDayDetail;
        }
        if(data.domainDetail) {
            this.domainDetail = data.domainDetail;
        }
        if(data.domainMessageDefault) {
            this.domainMessageDefault = data.domainMessageDefault;
        }
        if(data.workingTimeType) {
            this.workingTimeType = data.workingTimeType;
        }
    }
}