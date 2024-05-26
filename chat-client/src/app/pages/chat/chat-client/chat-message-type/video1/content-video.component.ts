import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FileService} from "../../../../../shared/services/chat-client/file.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {DomainDataService} from "../../../../../core/services/domain-data.service";

@Component({
    selector: 'app-content-video',
    templateUrl: './content-video.component.html',
    styleUrls: ['./content-video.component.scss']
})
export class ContentVideoComponent implements OnInit {
    @Input() mess: any;
    filePath: string | undefined;
    url?: string | SafeUrl
    @ViewChild("videoRef") private videoRef: ElementRef<HTMLVideoElement> | undefined;

    constructor(private fileService: FileService, private sanitize: DomSanitizer, private domainDataService: DomainDataService) {
    }

    ngOnInit(): void {
        this.filePath = this.mess.files && this.mess.files[0];
        if (this.filePath) {
            this.fileService.getContentFilePublic(this.filePath, this.domainDataService?.realmName!).subscribe(res => {
                if (res.body) {
                    this.url = this.sanitize.bypassSecurityTrustResourceUrl(URL.createObjectURL(res.body));
                    this.videoRef!.nativeElement.load();
                }
            })
        } else {
            this.url = this.sanitize.bypassSecurityTrustResourceUrl(this.mess.safeUrls[0])
        }
    }

}
