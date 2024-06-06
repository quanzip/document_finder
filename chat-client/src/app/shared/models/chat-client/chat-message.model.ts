import {SurveyParamModel} from "./survey-param.model";
import {ConfirmModel} from "./confirm.model";

export class ChatMessageModel {
    messageId: string;
    serviceType: number;
    sender: string;
    userType: number;
    userId: string;
    ticketId: number;
    content: string;
    contentExtra: string;
    topic: string;
    safeUrls: string[]
    files: string[];
    filesName: string[];
    // fileSize: number[];
    fileSize: number;
    type: number;  // 1: message, 2: file, 3 audio, 4: video, 8 file doc
    onlyEmoji: boolean;
    hasSurvey: boolean;
    linkSurvey: string;
    status: number;   // 0 failed, 1 sent, 2: seen, 3: sending
    sendTime: number;
    isRepliable: boolean;
    isReplyMessage: boolean;
    replyMsgId: string;
    replyMsg: string;  // content
    replyFilesName: string;
    replyFiles: string;
    replyType: number;
    replyUserType: number;
    isReplyingAlbum: boolean;
    ticketDetailId: string;
    survey?: SurveyParamModel;
    confirmModel?: ConfirmModel
    suggestNewQuestion?: boolean;


    constructor(messageId: string, serviceType: number, sender: string, userType: number, userId: string, ticketId: any, onlyEmoji: boolean, hasSurvey: boolean,
                content: string, linkSurvey: string, contentExtra: string, topic: string, safeUrls: string[], file: string[], fileName: string[],
                fileSize: number, type: number, status: number, sendTime: number, isRepliable: boolean, isReplyMessage: boolean, replyMessageId: string,
                replyMsg: string, replyFiles: string, replyFilesName: string, replyType: number, replyUserType: number, isReplyingAlbum: boolean, ticketDetailId: string) {
        this.serviceType = serviceType;
        this.messageId = messageId;
        this.status = status;
        this.sender = sender;
        this.fileSize = fileSize;
        this.userType = userType;
        this.userId = userId;
        this.ticketId = ticketId;
        this.content = content;
        this.contentExtra = contentExtra;
        this.topic = topic;
        this.safeUrls = safeUrls;
        this.files = file;
        this.filesName = fileName;
        this.type = type;
        this.onlyEmoji = onlyEmoji;
        this.hasSurvey = hasSurvey;
        this.linkSurvey = linkSurvey;
        this.sendTime = sendTime;
        this.isReplyMessage = isReplyMessage;
        this.replyMsgId = replyMessageId;
        this.replyFilesName = replyFilesName;
        this.replyMsg = replyMsg;
        this.replyFiles = replyFiles;
        this.replyType = replyType;
        this.replyUserType = replyUserType;
        this.isRepliable = isRepliable;
        this.isReplyingAlbum = isReplyingAlbum;
        this.ticketDetailId = ticketDetailId;
    }
}
