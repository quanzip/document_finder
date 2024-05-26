import {ChatClientStateModel} from "./chat-client-state.model";
import {MessageModel} from "./messageModel";

export class FileObject {
    originFiles: File[] = [];
    safeUrl: string[] = [];
    serverPaths: string[] = [];
    names: string[] = [];
    mimeTypes: string[] = [];
    types: number[] = [];
    fileSizes: number[] = [];
    errorMsg: string[] = []
}

export class SendingMessage {
    content: string = '';
    files: FileObject = new FileObject();
    // 1: message = ; 2: image = ; 3 audio = ; 4: video = ; 5 other
    type: string = '';
    onlyEmoji: boolean = false;
    isReplyMessage: boolean = false;
    replyFilesName: string = '';
    replyUserType: number = -1;
    replyMsgId: string = '';
    replyMsg: string = '';
    replySendTime: number = 0;
    replyFiles: string = '';
    replyType: number = -1
    isReplyingAlbum: boolean = false;
}

export class ChatClientModel {
    // message = false;
    showService = true;
    endChat = false;
    attempToConnectChatServer = false;
    chatServerConnection = false;
    isNetworkAvailable = false;
    chatMessage = new SendingMessage();
    conversationId = '';
    showChatBox = true;
    isTyping = false;
    chatState: ChatClientStateModel = new ChatClientStateModel();

    serviceId = '';
    notifyMessage: MessageModel[] = []
    showError = false;
}
