import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {EmotionModel} from "../../../../../shared/models/chat-client/emotionModel";
import {EmotionService} from "../../../../../core/services/emotion.service";
import {DomainDataService} from "../../../../../core/services/domain-data.service";
import {FileService} from "../../../../../shared/services/chat-client/file.service";
import {ResponseEnvelope} from "../../../../../shared/models/chat-client/ResponseEnvelope";
import {Subscription} from "rxjs";
import {EmotionEventService} from "../../../../../core/services/emotion-event.service";

export type Gif = { id: number; url: string; description: string };

@Component({
    selector: 'app-gif',
    templateUrl: './gif.component.html',
    styleUrls: ['./gif.component.scss']
})
export class GifComponent implements OnInit, OnDestroy {
    @Output() gifPicked = new EventEmitter<EmotionModel>();
    filteredGifList: EmotionModel[] = [];
    gifSearchInput: string = '';
    currentGifSize: number = 10;
    allItemLoaded = false;
    loading = false;
    private gifEventSubscription: Subscription | undefined;

    constructor(private domainDataService: DomainDataService, private emotionService: EmotionService, private changeDetector: ChangeDetectorRef, private fileService: FileService,
                private emotionEventService: EmotionEventService) {
    }

    onScroll(event: any) {
        // visible height + pixel scrolled >= total height
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight && !this.allItemLoaded) {
            this.loading = true;
            this.currentGifSize = this.currentGifSize + 10;
            console.log("Scroll reach the end!")
            let gifSubscription = this.emotionService.loadGifsBySize(this.domainDataService.realmName, this.currentGifSize, '1');
            gifSubscription.subscribe((result: ResponseEnvelope<any>) => {
                let data = result.data;
                this.loading = false;
                if (data && data.length == this.filteredGifList.length) {
                    this.allItemLoaded = true;
                    return;
                }

                if (data) {
                    this.filteredGifList = data;
                    this.changeDetector.detectChanges();
                }
            })
        }
    }

    ngOnDestroy(): void {
        this.gifEventSubscription?.unsubscribe();
    }

    public loadFileContent(path: string) {
        return this.fileService.getURLContentFilePublic(path, this.domainDataService.realmName);
    }

    private reloadGif() {
        this.filteredGifList = this.emotionService.listGifs;
    }

    ngOnInit(): void {
        this.gifEventSubscription = this.emotionEventService.gifEvent$.subscribe(result => {
            if (result) {
                this.reloadGif();
            }
        });
    }

    changeFilteredGifList() {
        this.filteredGifList = this.emotionService.listGifs.filter(item => item.stickerName.toUpperCase()
            .search(this.gifSearchInput?.trim().toUpperCase()) != -1)
    }

    chooseGif(gif: EmotionModel) {
        this.gifPicked.emit(gif);
    }

}
