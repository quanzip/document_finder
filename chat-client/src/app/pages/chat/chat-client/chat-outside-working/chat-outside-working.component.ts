import {Component, OnInit, Injector} from '@angular/core';
import {ChatServiceComponent} from '../chat-service/chat-service.component';


@Component({
    selector: 'app-outside-working',
    templateUrl: './chat-outside-working.component.html',
    styleUrls: ['./chat-outside-working.css']
})

export class ChatOutsideWorkingComponent extends ChatServiceComponent implements OnInit {
    // public returnMainMenu() {
    //     this.chatModel.leave_message_back = false;
    //     this.chatModel.leave_message_bar = true;
    //
    //     this.chatModel.no_work_time = this.checkNoWorkTime(this.chatModel.login.selectedService.serviceId);
    //     this.chatModel.login.content = '';
    //     if (this.chatModel.domainChatInfo.listService.length > 1) {
    //         this.setOutsideWorking(true);
    //         this.chatModel.isChatting = false;
    //         this.chatModel.isSignin = false;
    //     } else {
    //         // service
    //         if (!this.chatModel.no_work_time || this.chatModel.isChatting) {
    //             // switch to chat
    //             this.setOutsideWorking(false);
    //             this.chatModel.maximize = true;
    //             parent.postMessage('openChatBox', '*');
    //         } else {
    //             // back to leave message
    //             this.setOutsideWorking(true);
    //             parent.postMessage('openChatBox', '*');
    //         }
    //     }
    //
    // }
    //
    //
    // private checkNoWorkTime(serviceId) {
    //     const arrNoWorkTime = this.chatModel.list_no_work_time.split(';');
    //     for (let i = 0; i < this.chatModel.domainChatInfo.listService.length; i++) {
    //         if (serviceId === this.chatModel.domainChatInfo.listService[i].serviceId) {
    //             if (arrNoWorkTime.length > 0 && arrNoWorkTime[i] === '1') {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         }
    //     }
    //     return false;
    // }
    //
    // private timeoutLeaveMessage() {
    //     if (this.chatModel.leave_message_back === false) {
    //         this.chatModel.leaveMessageResult = 'OK';
    //         this.chatModel.leave_message_back = true;
    //     } else {
    //         this.chatModel.leaveMessageResult = 'NOK';
    //     }
    //
    // }
    //
    // onSubmit() {
    //     const thiz: ChatOutsideWorkingComponent = this['settings']['component'];
    //     if (thiz.chatModel.leave_message_bar === true) {
    //         if (thiz.chatModel.login.username != null) {
    //             thiz.chatModel.login.username = thiz.chatModel.login.username.trim();
    //         }
    //         if (thiz.chatModel.login.email != null) {
    //             thiz.chatModel.login.email = thiz.chatModel.login.email.trim();
    //         }
    //
    //         if (thiz.chatModel.login.content != null) {
    //             thiz.chatModel.login.content = thiz.chatModel.login.content.trim();
    //             console.log(thiz.chatModel.login.content);
    //         }
    //         thiz.chatModel.login.userCode = thiz.chatModel.chatState.username;
    //         thiz.chatModel.login.service_id = thiz.chatModel.listServiceStr;
    //         thiz.chatModel.login.domainCode = thiz.chatModel.domainChatInfo.domainCode;
    //         // Start chat
    //         thiz.send(ObjectIDManager.LEAVE_MESSAGE, thiz.chatModel.login);
    //         thiz.chatModel.leaveMessageProcessing = true;
    //         thiz.chatModel.leave_message_bar = true;
    //     }
    //
    //     // setTimeout(thiz.updateUserInfoStartChat(thiz.chatModel), 1000, thiz.chatModel.login.username, thiz.chatModel.login.email, thiz.chatModel.login.selectedService);
    //     // setTimeout(() => {
    //     //     thiz.timeoutLeaveMessage();
    //     // }, 5000);
    // }

}

