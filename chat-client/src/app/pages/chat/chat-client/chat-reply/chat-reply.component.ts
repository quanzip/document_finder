import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ChatClientModel} from "../../../../shared/models/chat-client/chat-client.model";
import {TranslateService} from "@ngx-translate/core";
import {DomainDataService} from "../../../../core/services/domain-data.service";

@Component({
    selector: 'app-chat-reply',
    templateUrl: './chat-reply.html',
    styleUrls: ['./chat-reply.css']
})

export class ChatReplyComponent {
    @Input() chatModel: ChatClientModel = new ChatClientModel();
    @Output() replyEvent = new EventEmitter()
    private stickerPrefix = 'Sticker';
    private gifSuffix = 'Gif'

    constructor(private trans: TranslateService, public domainDataService: DomainDataService) {
    }

    closeReply() {
        this.replyEvent.emit(0);
    }

    getResource() {
        let resource = '';
        let type = this.chatModel.chatMessage.replyType
        if (type == 8 || type == 15 || type == 17) {
            // let fileName = this.chatModel.chatMessage.replyFilesName;
            // let extention = fileName.substring(fileName.lastIndexOf(".")).toUpperCase();
            // // let isGif = extention.toUpperCase().indexOf('GIF') > 0;
            // // if(isGif){
            // // //  get thumnail from gif
            // //
            // // }else {
            // //     resource = this.chatModel.chatMessage.replyFiles
            // // }
            resource = this.chatModel.chatMessage.replyFiles
        }
        if (type == 4) {
            // get thumbnail from video
        }

        return resource;
    }

    isTextNotTruncated() {
        let content = '';
        let result = true;
        let replyType = this.chatModel.chatMessage.replyType;
        let fileName = this.chatModel.chatMessage.replyFilesName;
        if (replyType == 3 || replyType == 2) {
            content = fileName;
        } else if (replyType == 1) {
            content = this.chatModel.chatMessage.replyMsg;
        }
        if (content.length > 42) {
            result = false;
        }
        return result;
    }

    getContent(): string {
        let content = '';
        let replyType = this.chatModel.chatMessage.replyType;
        let fileName = this.chatModel.chatMessage.replyFilesName;
        let isReplyingAlbum = this.chatModel.chatMessage.isReplyingAlbum;
        let extention = fileName.substring(fileName.lastIndexOf("."));
        if (replyType == 8) {
            // let fileNameSection = fileName.substring(0,this.stickerPrefix.length);
            // content = extention.toUpperCase().indexOf(this.gifSuffix) >= 0 ? this.gifSuffix :
            //     (fileNameSection.indexOf(this.stickerPrefix) >= 0 ? this.stickerPrefix : 'Ảnh');
            if (isReplyingAlbum) {
                content = 'Album';
            } else {
                content = 'Ảnh';
            }
        } else if (replyType == 15) {
            content = this.stickerPrefix
        } else if (replyType == 17) {
            content = this.gifSuffix;
        } else if (replyType == 4) {
            content = 'Video'
        } else if (replyType == 3 || replyType == 2) {
            content = fileName;
            if (content.indexOf(' ') < 0 && content.length > 40) {
                content = content.substring(0, 32) + '... ' + extention;
            }
        } else if (replyType == 1) {
            content = this.chatModel.chatMessage.replyMsg;
        }


        return content;
    }

    getFullContent(): string {
        let content = '';
        let replyType = this.chatModel.chatMessage.replyType;
        let fileName = this.chatModel.chatMessage.replyFilesName;
        let isReplyingAlbum = this.chatModel.chatMessage.isReplyingAlbum;
        if (replyType == 8) {
            if (isReplyingAlbum) {
                content = 'Album';
            } else {
                content = 'Ảnh';
            }
        } else if (replyType == 15) {
            content = this.stickerPrefix
        } else if (replyType == 17) {
            content = this.gifSuffix;
        } else if (replyType == 4) {
            content = 'Video'
        } else if (replyType == 3 || replyType == 2) {
            content = fileName;
        } else if (replyType == 1) {
            content = this.chatModel.chatMessage.replyMsg;
        }
        return content;
    }
}