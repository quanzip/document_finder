import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatClientModel} from '../../../../shared/models/chat-client/chat-client.model';
import {UserProfileService} from "../../../../core/services/user-data.service";
import {DomainDataService} from "../../../../core/services/domain-data.service";
import {FileService} from "../../../../shared/services/chat-client/file.service";

@Component({
    selector: 'app-chat-header',
    templateUrl: './chat-header.component.html',
    styleUrls: ['../chat-client.component.scss', './chat-header.component.css',]
})

export class ChatHeaderComponent implements OnInit {
    @Input() chatModel: ChatClientModel = new ChatClientModel();
    @Input() profile: String | undefined;
    @Output() changeHeader = new EventEmitter<ChatClientModel>();
    smallAvatar: string = '';

    ngOnInit() {
        // this.smallAvatar =  this.fileService.getURLContentFilePublic(this.domainDataService.avatarImg, this.domainDataService.realmName);
        this.smallAvatar =  '.\\assets\\images\\plan.png';
    }

    getTruncateFileName(title: string): string {

        if (title.length > 25) {
            title = title.trim().substring(0, 20) + '...';
        }
        return title;
    }

    constructor(public userDataService: UserProfileService, public domainDataService: DomainDataService, private fileService: FileService) {
    }

    closeChatBox() {
        this.chatModel.showChatBox = false;
        this.changeHeader.emit(this.chatModel);
    }

    openService() {
        this.chatModel.showService = true;  // need edit
        this.changeHeader.emit(this.chatModel);
    }

    private restoreCustomerInfo() {
        if (localStorage.getItem('customerInfo_' + this.domainDataService.domainId) !== null) {
            // @ts-ignore
            this.userDataService.saveDataClient(JSON.parse(localStorage.getItem('customerInfo_' + this.domainDataService.domainId)));
        }
    }
}

