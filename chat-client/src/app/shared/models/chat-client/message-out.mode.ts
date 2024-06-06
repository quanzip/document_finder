import {ContentModel} from "./content.model";

export class MessageOut{
    messageId: string;  // only use for send seen status to chat-server
    channelId: number  //   ID kênhs
    authorType: string //
    authorId: string // id chat-server trả về
    type: number //   1: Text, Emoj, Link 2: File (doc, docx, war…) 3: Audio 4: Video 5: Voice GMSC
    // 6:Voice OTT 7: SMS 8: Image(Sticker, Gif, PNG…) 9: Location 10: Contact 11: Caroseul 12: Quickreply
    // 13:Button 14: Email

    content: string //  Nội dung (dạng text)
    contents: ContentModel[];
    contentExtra: string //
    fileUrl: string[] //  Đường dẫn file đính kèm
    fileName: string[] // Tên file đính kèm
    fileSize: number[] //
    originalMessageId: string //
    originalMessageTimestamp: string //
    integrationId: string //
    serviceId: string //
    replyTo: string //   ID tin nhắn reply tới
    status: number //  0: Gửi lỗi, 1: Đã gửi, 2: Đã xem, 3: Đang gửi
    conversationId: string;
    typing: boolean;
    domainCode: string
    suggestNewQuestion: boolean;

    constructor(messageId: string, channelId: number, conversationId: string, authorType: string, authorId: string, type: number, content: string,
                contentExtra: string, fileUrl: string[], fileName: string[], fileSize: number[], originalMessageId: string, originalMessageTimestamp: string
                , integrationId: string,
                serviceId: string, replyTo: string, status: number, typing: boolean, domainCode: string, contents: ContentModel[]) {
        this.messageId = messageId;
        this.channelId = channelId;
        this.conversationId = conversationId;
        this.authorType = authorType;
        this.authorId = authorId;
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
        this.domainCode = domainCode;
        this.contents = contents
    }
}