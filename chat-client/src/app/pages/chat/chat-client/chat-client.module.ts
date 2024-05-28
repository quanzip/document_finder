import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatBodyComponent} from "./chat-body/chat-body.component";
import {ChatHeaderComponent} from './chat-header/chat-header.component';
import {ChatToolbarComponent} from './chat-toolbar/chat-toolbar.component';
import {ChatUploaderComponent} from './uploader-component/chat-uploader.component';
import {ChatServiceComponent} from './chat-service/chat-service.component';
import {ChatOutsideWorkingComponent} from "./chat-outside-working/chat-outside-working.component";

// @ts-ignore
// import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';
import {LightboxModule} from 'ngx-lightbox';
import {SimplebarAngularModule} from "simplebar-angular";
import {ChatDomainService} from "../../../shared/services/chat-client/chat.domain.service";
import {ChatServerStompService} from "../../../shared/services/chat-server-stomp.service";
import {FormsModule} from "@angular/forms";
import {MessagingService} from "../../../shared/services/messaging.service";
import {NgbDropdownModule, NgbNavModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {PickerModule} from '@ctrl/ngx-emoji-mart';
import {EmojiPickerComponent} from "./emoji-picker/emoji-picker.component";
import {EmojiComponent} from "./emoji-picker/emoji/emoji.component";
import {GifComponent} from "./emoji-picker/gif/gif.component";
import {StickerComponent} from "./emoji-picker/sticker/sticker.component";
import {ChatReplyComponent} from "./chat-reply/chat-reply.component";
import {SeenMessageInService} from "../../../shared/services/seen-message-in.service";
import {ChatCloseComponent} from "./chat-close/chat-close.component";
import {AudioComponent} from "./chat-message-type/audio/audio.component";
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../../../shared/shared.module";
import {ContentVideoComponent} from "./chat-message-type/video1/content-video.component";
import {TextComponent} from "./chat-message-type/text/text.component";
import {ChatSuggestComponent} from "./chat-suggest/chat-suggest.component";
import {ChatHistoryComponent} from "./chat-history/chat-history.component";

@NgModule({
    imports: [
        CommonModule,
        // NgxEmojiPickerModule,
        LightboxModule,
        SimplebarAngularModule,
        NgbTooltipModule,
        PickerModule,
        FormsModule,
        NgbDropdownModule,
        NgbNavModule,
        TranslateModule,
        SharedModule,
    ],
    declarations: [
        ChatCloseComponent,
        ChatBodyComponent,
        ChatHeaderComponent,
        ChatToolbarComponent,
        ChatUploaderComponent,
        ChatServiceComponent,
        ChatOutsideWorkingComponent,
        EmojiPickerComponent,
        EmojiComponent,
        GifComponent,
        StickerComponent,
        ChatReplyComponent,
        AudioComponent,
        ContentVideoComponent,
        TextComponent,
        ChatSuggestComponent,
        ChatHistoryComponent
    ],
    exports: [
        ChatHeaderComponent,
        ChatToolbarComponent,
        ChatBodyComponent,
        ChatServiceComponent
    ],
    providers: [
        ChatDomainService,
        ChatServerStompService,
        MessagingService,
        SeenMessageInService
    ]
})
export class ChatClientModule {
}
