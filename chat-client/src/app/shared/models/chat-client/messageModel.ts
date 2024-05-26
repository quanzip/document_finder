export class MessageModel {
    object = '';
    message = "";
    type = MessageType.UNKNOWN
    flag: MessageFlag = MessageFlag.INFO;


    constructor(object: string, message: string, type: MessageType, flag: MessageFlag) {
        this.object = object;
        this.message = message;
        this.type = type;
        this.flag = flag;
    }
}
export enum MessageType {
    SERVER= 'server', USER = 'user', UNKNOWN = 'unknown'
}

export enum MessageFlag {
    INFO, Warning, ERROR
}