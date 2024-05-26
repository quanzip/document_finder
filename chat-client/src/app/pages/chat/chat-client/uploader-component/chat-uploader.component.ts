import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
// @ts-ignore
import {FileUploader} from 'ng2-file-upload';

import {ChatClientModel} from "../../../../shared/models/chat-client/chat-client.model";

@Component({
    selector: 'app-chat-uploader',
    templateUrl: 'chat-uploader.component.html',
    styleUrls:['chat-uploader.component.css'],
})

export class ChatUploaderComponent implements OnInit {
    @Output() changeUploader = new EventEmitter<any>();
    @Output() returnFileUploader = new EventEmitter<FileUploader>();
    @Input() chatModel: ChatClientModel | undefined;

    @ViewChild('uploadEl') uploadElRef: ElementRef | undefined
    // public uploader: FileUploader = new FileUploader({url: environment.HTTP_SERVICE.HTTP_UPLOAD_SERVICE});
    private messageUpdate: string | undefined;

    // constructor(private notificationService: NotificationService, private i18nService: I18nService) {
    // }

    ngOnInit() {
        // this.uploader.onAfterAddingFile = (fileItem) => {
        //     fileItem.withCredentials = false;
        //
        //     if (this.validateUploadFile(fileItem._file)) {
        //         fileItem.upload();
        //     } else {
        //         this.notificationService.smallBox(new ErrorNotification(this.messageUpdate));
        //
        //     }
        //     this.uploadElRef.nativeElement.value = '';
        // };
        // // this.uploader.onBuildItemForm = (item, form) => {
        // //     form.append('fileUp', item._file);
        // //     return {item, form};
        // // };
        //
        // this.uploader.onCompleteItem = (item, response) => {
        //     if (response) {
        //         this.changeUploader.emit(response);
        //         console.log('Upload file success.');
        //     } else {
        //         console.error('Upload file false.');
        //     }
        // }
        //
        // this.uploader.onErrorItem = (item, response) => {
        //     alert(this.i18nService.getTranslation('Upload file false'));
        // }
        // this.returnFileUploader.emit(this.uploader);
    }

//     validateUploadFile(file: { size?: any; type?: any; name?: String; }) {
//         if (this.isFileValid(file) === false) {
//             this.messageUpdate = this.i18nService.getTranslation("lb.send.file.format");
//             return false;
//         }
//         if (file.size > 5 * 1024 * 1024) {
//             this.messageUpdate = this.i18nService.getTranslation("lb.send.file.maxsize");
//             return false;
//         }
//         return true;
//     }
//
//     isFileValid(file: { type: any; name: String; }): boolean {
//         const isMediaValidImage = (ALLOWED_IMAGE.indexOf(file.type) > -1);
//         const isMediaValidEmail = (ALLOWED_FILE_CHAT.indexOf(file.type) > -1);
//         const isCsv = this.checkCsv(file.name);
//         return isMediaValidImage || (isMediaValidEmail && !isCsv);
//     }
//
//     checkCsv(name: String) {
//         const ext = name.substring(name.lastIndexOf('.') + 1);
//         if (ext.toLowerCase() === 'csv') {
//             return true;
//         } else {
//             return false;
//         }
//     }
}
