import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {SimplebarAngularComponent} from "simplebar-angular";
import {EmotionService} from "../../../../../core/services/emotion.service";
import {EmotionGroup} from "../../../../../shared/models/chat-client/emotion-group";
import {EmotionModel} from "../../../../../shared/models/chat-client/emotionModel";
import {DomainDataService} from "../../../../../core/services/domain-data.service";
import {FileService} from "../../../../../shared/services/chat-client/file.service";
import {ResponseEnvelope} from "../../../../../shared/models/chat-client/ResponseEnvelope";
import {Subscription} from "rxjs";
import {EmotionEventService} from "../../../../../core/services/emotion-event.service";

export type Sticker = { id: number; url: string; category: string };

@Component({
    selector: 'app-sticker',
    templateUrl: './sticker.component.html',
    styleUrls: ['./sticker.component.scss']
})
export class StickerComponent implements OnInit, OnDestroy {
    @Output() stickerPicked = new EventEmitter<EmotionModel>();
    stickerCategories: EmotionGroup[] = [];
    selectedStickerCategory: string | undefined;
    loading = false;
    selectedStickerList: EmotionModel[] = [];
    private emotionEventSubscription: Subscription | undefined;

    constructor(private domainDataService: DomainDataService,
                private emotionService: EmotionService,
                private emotionEvent: EmotionEventService,
                private changeDetector: ChangeDetectorRef,
                private fileService: FileService) {
    }

    ngOnDestroy(): void {
        this.emotionEventSubscription?.unsubscribe();
    }

    public loadFileContent(path: string){
        return this.fileService.getURLContentFilePublic(path, this.domainDataService.realmName);
    }


    ngOnInit(): void {
        this.emotionEventSubscription = this.emotionEvent.stickerEvent$.subscribe(result => {
            if(result) {
                this.loadStickers();
            }
        })
    }

    loadStickers(){
        this.stickerCategories = this.emotionService.categories;
        if(this.stickerCategories && this.stickerCategories.length > 0) {
            this.selectedStickerCategory = this.stickerCategories[0].groupId;
            this.selectedStickerList = this.listStickerByCategory(this.selectedStickerCategory);
        }
    }

    listStickerByCategory(category: string) {
        // @ts-ignore
        return this.emotionService.stickerMapByGroupName[category];
    }

    selectStickerCategory(category: string, scrollBar: SimplebarAngularComponent) {
        this.loading = true;
        this.scrollToTop(scrollBar);
        this.selectedStickerCategory = category;
        this.selectedStickerList = this.listStickerByCategory(category);
        if (!this.selectedStickerList) {
            window.setTimeout(() => {
                let stickerByGroupIdSubscription = this.emotionService.loadStickerByGroupIdAndType(category, this.domainDataService.realmName,'0');
                stickerByGroupIdSubscription.subscribe((result: ResponseEnvelope<any>) => {
                    this.loading = false;
                    if (result) {
                        this.selectedStickerList = result.data;
                        // @ts-ignore
                        this.emotionService.stickerMapByGroupName[category] = this.selectedStickerList
                        this.changeDetector.detectChanges()
                    }
                }, error => {
                    this.loading = false;
                })
            }, 500)
        } else {
            this.loading = false;
        }
    }

    scrollToTop(scrollBar: SimplebarAngularComponent) {
        scrollBar.SimpleBar.getScrollElement().scrollTop = 0;
    }

    scrollStickerCategoryScrollerTo(stickerCategoryScroller: HTMLDivElement, moveForward: boolean) {
        let distance: number;
        if (moveForward) {
            distance = 212;
        } else {
            distance = -212;
        }
        stickerCategoryScroller.scrollTo({
            left: stickerCategoryScroller.scrollLeft + distance,
            behavior: 'smooth'
        })
    }

    chooseSticker(sticker: EmotionModel) {
        this.stickerPicked.emit(sticker);
    }
}
