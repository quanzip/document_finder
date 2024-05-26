import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Emoji} from "./emoji/emoji.component";
import {DomainDataService} from "../../../../core/services/domain-data.service";
import {EmotionModel} from "../../../../shared/models/chat-client/emotionModel";
import {ResponseEnvelope} from "../../../../shared/models/chat-client/ResponseEnvelope";
import {EmotionService} from "../../../../core/services/emotion.service";
import {ConfigService} from "../../../../shared/services/config.service";
import {EmotionEventService} from "../../../../core/services/emotion-event.service";

declare let $: any;

@Component({
    selector: 'app-emoji-picker',
    templateUrl: './emoji-picker.component.html',
    styleUrls: ['./emoji-picker.component.scss']
})
export class EmojiPickerComponent implements OnInit {
    @Output() emojiPicked = new EventEmitter<Emoji>();
    @Output() stickerPicked = new EventEmitter<EmotionModel>();
    @Output() gifPicked = new EventEmitter<EmotionModel>();

    @Input() enableSendEmoji: boolean | undefined
    @Input() enableSendSticker: boolean | undefined
    @Input() enableSendGif: boolean | undefined
    protected showIcon = false;

    constructor(public domainDataService: DomainDataService, private emotionService: EmotionService,
                private emotionEventService: EmotionEventService) {
    }

    changeIcon() {
        this.showIcon = !this.showIcon;
    }

    ngOnInit(): void {
        let realmName = this.domainDataService.realmName;
        if (!this.emotionService.isStickerLoaded()) {
            let emotionSubscription = this.emotionService.getThumbNailsAndFirstGroup(realmName, '0');
            emotionSubscription.subscribe((result: ResponseEnvelope<any>) => {
                this.emotionService.categories = result.data['GROUP'];
                this.emotionService.stickerMapByGroupName = result.data['STICKERS'];
                this.emotionEventService.reloadStickerList(true);
            })
        }else {
            this.emotionEventService.reloadStickerList(true);
        }

        if (!this.emotionService.isGifLoaded()) {
            let gifSubscription = this.emotionService.loadGifsBySize(realmName, 10, '1');
            gifSubscription.subscribe((result: ResponseEnvelope<any>) => {
                if (result.data) {
                    this.emotionService.listGifs = result.data
                    this.emotionEventService.reloadGifList(true);
                }
            })
        }else {
            this.emotionEventService.reloadGifList(true);
        }

        // let stickerByGroupIdSubscription = this.emotionService.loadStickerByGroupIdAndType('2', this .domainDataService.realmName,'0');
        // stickerByGroupIdSubscription.subscribe((result: ResponseEnvelope<any>) => {
        //     this.emotionService.categories = result.data['GROUP'];
        //     this.emotionService.stickerMapByGroupName = result.data['STICKERS'];
        // })
    }


    chooseEmoji(emoji: Emoji) {
        this.emojiPicked.emit(emoji);
    }

    chooseSticker(sticker: EmotionModel) {
        this.stickerPicked.emit(sticker);
    }

    chooseGif(gif: EmotionModel) {
        this.gifPicked.emit(gif);
    }
}
