export class MessageIn{
    id: string;
    channelId: number;
    authorType: string;
    authorName: string;
    authorId: string;
    conversationId: string;
    receivedAt: number;
    type: number;
    content: string;
    contentExtra: string;
    fileUrl: string[];
    fileName: string[];
    fileSize: number;
    originalMessageId: string;
    originalMessageTimestamp: number;
    integrationId: string;
    serviceId: number;
    replyTo: string;
    status: number;
    typing: boolean;
    siteCode: string

    surveyClientId: string;
    surveyFrequency: number;
    surveyFrequencyUnit: number;

    constructor(id: string, channelId: number, authorType: string, authorId: string, authorName: string, conversationId: string, receivedAt: number, type: number, content: string,
                contentExtra: string, fileUrl: string[], fileName: string[], fileSize: number, originalMessageId: string,
                originalMessageTimestamp: number, integrationId: string, serviceId: number, replyTo: string, status: number, typing: boolean,
                surveyClientId: string, surveyFrequency: number, surveyFrequencyUnit: number) {
        this.id = id;
        this.channelId = channelId;
        this.authorType = authorType;
        this.authorId = authorId;
        this.authorName = authorName;
        this.conversationId = conversationId;
        this.receivedAt = receivedAt;
        this.type = type;
        this.content = content;
        this.contentExtra = contentExtra;
        this.fileUrl = fileUrl;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.originalMessageId = originalMessageId;
        this.originalMessageTimestamp = originalMessageTimestamp;
        this.integrationId = integrationId;
        this.serviceId = serviceId;
        this.replyTo = replyTo;
        this.status = status;
        this.typing = typing;
        this.surveyClientId = surveyClientId;
        this.surveyFrequency = surveyFrequency;
        this.surveyFrequencyUnit = surveyFrequencyUnit;
    }
}