import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {ChatClientModel} from '../../../../shared/models/chat-client/chat-client.model';
import {Emoji} from "../emoji-picker/emoji/emoji.component";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {DomainDataService} from "../../../../core/services/domain-data.service";
import {PROPERTIES} from "../../../../../environments/environment";
import {KpiConfigParamModel} from "../../../../shared/models/chat-client/kpi-config-param.model";
import {EmotionModel} from "../../../../shared/models/chat-client/emotionModel";
import {FileService} from "../../../../shared/services/chat-client/file.service";
import {v4 as uuidv4} from "uuid";
import {TranslateService} from "@ngx-translate/core";
import {DomainDataEventService} from "../../../../core/services/domain-data-event.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-chat-toolbar',
    templateUrl: './chat-toolbar.component.html',
    styleUrls: ['../chat-client.component.scss']
})

export class ChatToolbarComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() chatModel!: ChatClientModel;
    @Output() fileChanges = new EventEmitter<ChatClientModel>();
    files: any;

    emoji = ''
    onlyEmoij: boolean | undefined;
    showEmojiPicker = false;
    isChoosingFile = false;

    configsSubscription: Subscription | undefined;

    messageType = {
        image: 8,
        mp3: 3,
        video: 4,
        STICKER: 15,
        GIF: 17,
        otherFile: 2
    }
    AllowedImageFileSize: KpiConfigParamModel | undefined;
    AllowedAudioFileSize: KpiConfigParamModel | undefined;
    AllowedVideoFileSize: KpiConfigParamModel | undefined;
    AllowedOtherFileSize: KpiConfigParamModel | undefined;

    imgs: string | undefined
    mp3s: string | undefined
    mp4s: string | undefined
    others: string | undefined

    public enableSendFile = false;
    public enableSendReaction = false;
    public enableSendEmoji = false;
    public enableSendSticker = false;
    public enableSendGif = false;

    constructor(private http: HttpClient, private injector: Injector, private sanitizer: DomSanitizer, public domainDataService: DomainDataService
        , private fileService: FileService, private translate: TranslateService, private changeDetector: ChangeDetectorRef,
                private domainDataEventService: DomainDataEventService) {
    }

    ngOnDestroy(): void {
        this.configsSubscription?.unsubscribe();
    }

    ngAfterViewInit() {
        this.domainDataEventService.reloadUploadingConfigs(true)
    }


    public loadConfig() {
        // @ts-ignore
        if (!this.domainDataService.configParams || !this.domainDataService.configParams[PROPERTIES.AllowedImageFileSizeId]) {
            this.AllowedImageFileSize = new KpiConfigParamModel();
            this.AllowedImageFileSize.value = PROPERTIES.AppConfigFileDefaultSize.toString();
        } else {
            // @ts-ignore
            this.AllowedImageFileSize = this.domainDataService.configParams[PROPERTIES.AllowedImageFileSizeId];
        }
        // @ts-ignore
        if (!this.domainDataService.configParams || !this.domainDataService.configParams[PROPERTIES.AllowedAudioFileSizeId]) {
            this.AllowedAudioFileSize = new KpiConfigParamModel();
            this.AllowedAudioFileSize.value = PROPERTIES.AppConfigFileDefaultSize.toString();
        } else {
            // @ts-ignore
            this.AllowedAudioFileSize = this.domainDataService.configParams[PROPERTIES.AllowedAudioFileSizeId];
        }
        // @ts-ignore
        if (!this.domainDataService.configParams || !this.domainDataService.configParams[PROPERTIES.AllowedVideoFileSizeId]) {
            this.AllowedVideoFileSize = new KpiConfigParamModel();
            this.AllowedVideoFileSize.value = PROPERTIES.AppConfigFileDefaultSize.toString();
        } else {
            // @ts-ignore
            this.AllowedVideoFileSize = this.domainDataService.configParams[PROPERTIES.AllowedVideoFileSizeId];
        }
        // @ts-ignore
        if (!this.domainDataService.configParams || !this.domainDataService.configParams[PROPERTIES.AllowedOtherFileSizeId]) {
            this.AllowedOtherFileSize = new KpiConfigParamModel();
            this.AllowedOtherFileSize.value = PROPERTIES.AppConfigFileDefaultSize.toString();
        } else {
            // @ts-ignore
            this.AllowedOtherFileSize = this.domainDataService.configParams[PROPERTIES.AllowedOtherFileSizeId];
        }

        // @ts-ignore
        this.imgs = this.domainDataService.configParams ? this.domainDataService.configParams[PROPERTIES.AllowImgTypesId]?.value?.toUpperCase() : '';
        // @ts-ignore
        this.mp3s = this.domainDataService.configParams ? this.domainDataService.configParams[PROPERTIES.AllowMp3TypesId]?.value?.toUpperCase() : '';
        // @ts-ignore
        this.mp4s = this.domainDataService.configParams ? this.domainDataService.configParams[PROPERTIES.AllowMp4TypesId]?.value?.toUpperCase() : '';
        // @ts-ignore
        this.others = this.domainDataService.configParams ? this.domainDataService.configParams[PROPERTIES.AllowOtherTypesId]?.value?.toUpperCase() : '';

        // @ts-ignore
        this.enableSendFile = this.domainDataService.configParams ? this.domainDataService.configParams[PROPERTIES.AllowSendFileId]?.value.toUpperCase() == 'ENABLE' : false;
        // @ts-ignore
        this.enableSendEmoji = this.domainDataService.configParams ? this.domainDataService.configParams[PROPERTIES.AllowSendEmojiId]?.value.toUpperCase() == "ENABLE" : false;
        // @ts-ignore
        this.enableSendSticker = this.domainDataService.configParams ? this.domainDataService.configParams[PROPERTIES.AllowSendStickerId]?.value.toUpperCase() == 'ENABLE' : false;
        // @ts-ignore
        this.enableSendGif = this.domainDataService.configParams ? this.domainDataService.configParams[PROPERTIES.AllowSendGifId]?.value.toUpperCase() == 'ENABLE' : false;
        this.changeDetector.detectChanges()
    }

    ngOnInit(): void {
        this.configsSubscription = this.domainDataEventService.configSubscription$.subscribe(result => {
            if (result) {
                this.loadConfig();
            }
        })
    }

    async changeFileInput(event: any) {
        this.onlyEmoij = false;
        let length = event.target.files.length;
        let fileInput = event.target.files;
        if (length > 0) {
            let files: File[] = fileInput;
            // this.chatModel.chatMessage.files.originFiles = files
            let count = 0;
            for (let file of files) {
                if (length == file) break;
                let fileName = file.name;

                /* if fileType == -2: file format is invalid, if -1: then file Size is invalid*/
                let fileType = this.getFileType(file.name);
                let isFileSizeInvalid = this.fileSizeIsInValid(file, fileName, count, fileType);
                let isFileInvalid = fileType < 0 || isFileSizeInvalid;
                fileType = isFileSizeInvalid ? -1 : fileType;

                // Convert file to local safe url
                let emptyFile = new File([], '')
                let safeUrl: string = isFileInvalid ? this.getLocalSafeUrl(emptyFile) : this.getLocalSafeUrl(file);

                this.chatModel.chatMessage.files.safeUrl.push(safeUrl)
                this.chatModel.chatMessage.files.fileSizes.push(file.size)
                this.chatModel.chatMessage.files.names.push(fileName)
                this.chatModel.chatMessage.files.types.push(fileType)
                this.chatModel.chatMessage.files.mimeTypes.push(file.type)

                this.chatModel.chatMessage.files.originFiles.push(isFileInvalid ? emptyFile : file)
                count++;
            }

            this.fileChanges.emit(this.chatModel);
            this.files = null;
        }
    }

    getLocalSafeUrl(file: File) {
        return URL.createObjectURL(file);
    }

    fileSizeIsInValid(file: File, fileName: string, count: number, fileType: number) {
        let isFileSizeInvalid = false;
        switch (fileType) {
            case this.messageType.image:
                isFileSizeInvalid = this.AllowedImageFileSize == undefined ? true : (file.size / (1024 * 1024)) > Number(this.AllowedImageFileSize.value);
                if (!this.chatModel.chatMessage.files.errorMsg[count]) this.chatModel.chatMessage.files.errorMsg.push(this.translate.instant("chat.error.invalid-size", {
                    param: fileName,
                    param1: this.AllowedImageFileSize!!.value
                }))
                return isFileSizeInvalid;
            case this.messageType.mp3:
                isFileSizeInvalid = this.AllowedAudioFileSize == undefined ? true : (file.size / (1024 * 1024)) > Number(this.AllowedAudioFileSize.value);
                if (!this.chatModel.chatMessage.files.errorMsg[count]) this.chatModel.chatMessage.files.errorMsg.push(this.translate.instant("chat.error.invalid-size", {
                    param: fileName,
                    param1: this.AllowedAudioFileSize!!.value
                }))
                return isFileSizeInvalid;
            case this.messageType.video:
                isFileSizeInvalid = this.AllowedVideoFileSize == undefined ? true : (file.size / (1024 * 1024)) > Number(this.AllowedVideoFileSize.value);
                if (!this.chatModel.chatMessage.files.errorMsg[count]) this.chatModel.chatMessage.files.errorMsg.push(this.translate.instant("chat.error.invalid-size", {
                    param: fileName,
                    param1: this.AllowedVideoFileSize!!.value
                }))
                return isFileSizeInvalid;
            case this.messageType.otherFile:
                isFileSizeInvalid = this.AllowedOtherFileSize == undefined ? true : (file.size / (1024 * 1024)) > Number(this.AllowedOtherFileSize.value);
                if (!this.chatModel.chatMessage.files.errorMsg[count]) this.chatModel.chatMessage.files.errorMsg.push(this.translate.instant("chat.error.invalid-size", {
                    param: fileName,
                    param1: this.AllowedOtherFileSize!!.value
                }))
                return isFileSizeInvalid;
            default :
                if (!this.chatModel.chatMessage.files.errorMsg[count]) this.chatModel.chatMessage.files.errorMsg.push('')
                return isFileSizeInvalid
        }
    }

    public loadFileContent(path: string) {
        return this.fileService.getURLContentFilePublic(path, this.domainDataService.realmName);
    }

    messageStickerSave(sticker: EmotionModel) {
        let url = this.loadFileContent(sticker.sourceUrl);
        this.onlyEmoij = false;
        this.http.get(url, {responseType: "blob"}).subscribe(data => {
            let fileName = "sticker" + uuidv4().replace(/-/g, "") + ".png"
            let file: any = new File([data], fileName);

            this.chatModel.chatMessage.files.originFiles = [file]
            // Convert file to local safe url
            let safeUrl: string = this.getLocalSafeUrl(file);

            this.chatModel.chatMessage.files.safeUrl.push(safeUrl)
            this.chatModel.chatMessage.files.names = [fileName];
            this.chatModel.chatMessage.files.mimeTypes = [file.type];
            this.chatModel.chatMessage.files.types = [this.messageType.STICKER];
            this.chatModel.chatMessage.files.fileSizes = [file.size];
            this.fileChanges.emit(this.chatModel);
        });
    }

    messageGifSave(gif: EmotionModel) {
        this.onlyEmoij = false;
        let url = this.loadFileContent(gif.sourceUrl);
        this.http.get(url, {responseType: "blob"}).subscribe(data => {
            let fileName = "gif" + uuidv4().replace(/-/g, "") + ".png"
            let file = new File([data], fileName);

            this.chatModel.chatMessage.files.originFiles = [file]
            let safeUrl: string = this.getLocalSafeUrl(file);

            this.chatModel.chatMessage.files.safeUrl.push(safeUrl)
            this.chatModel.chatMessage.files.names = [fileName];
            this.chatModel.chatMessage.files.mimeTypes = [file.type];
            this.chatModel.chatMessage.files.types = [this.messageType.GIF];
            this.chatModel.chatMessage.files.fileSizes = [file.size];
            this.fileChanges.emit(this.chatModel);
        });
    }

    addEmojiToChatInput(emoji: Emoji) {
        this.chatModel.chatMessage.content = this.chatModel.chatMessage.content + emoji.emoji
    }

    getFileType(fileName: string): number {
        let fileExtention = fileName.substring(fileName.lastIndexOf(".") + 1).toUpperCase();
        if (this.imgs && this.imgs.indexOf(fileExtention) != -1) {
            return this.messageType.image;
        } else if (this.mp3s && this.mp3s.indexOf(fileExtention) != -1) {
            return this.messageType.mp3;
        } else if (this.mp4s && this.mp4s.indexOf(fileExtention) != -1) {
            return this.messageType.video;
        } else if (this.others && this.others.indexOf(fileExtention) != -1)
            return this.messageType.otherFile;
        else {
            let allType = (this.imgs ? (this.imgs + ',') : '') + (this.mp3s ? (this.mp3s + ',') : '') + (this.mp4s ? (this.mp4s + ',') : '') + (this.others ? this.others : '')
            this.chatModel.chatMessage.files.errorMsg.push(this.translate.instant("chat.error.invalid-format", {
                'param': fileName,
                'param1': allType
            }))
            return -2;
        }
    }

}


