import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ChatClientModel} from "../../../../shared/models/chat-client/chat-client.model";
import {TranslateService} from "@ngx-translate/core";
import {DomainDataService} from "../../../../core/services/domain-data.service";
import {HistoryService} from "../../../../shared/services/chat-client/history.service";

@Component({
    selector: 'app-chat-history',
    templateUrl: './chat-history.html',
    styleUrls: ['./chat-history.css']
})

export class ChatHistoryComponent implements OnInit {
    @Input() chatModel: ChatClientModel = new ChatClientModel();
    @Output() historyEvent = new EventEmitter<any>()
    historyQuestions: any = ["quan"]

    selectedSuggest: any;
    constructor(private changeDetect: ChangeDetectorRef, private trans: TranslateService, public domainDataService: DomainDataService, private historyService: HistoryService) {
    }

    closeReply() {
        this.historyEvent.emit(null);
    }

    selectHisotry(suggest: any) {
        this.historyEvent.emit(suggest);
    }

    loadHistory() {
        // @ts-ignore
        let his = JSON.parse(localStorage.getItem('finder_his_' + this.domainDataService.domainCode))
        if (his) {
            this.historyQuestions = his;
            this.changeDetect.detectChanges()
        }
    }

    boldText(question: string, section: string) {
        return question.replace(section, `<b>${section}</b>`)
    }

    ngOnInit(): void {
        // @ts-ignore
        let his = JSON.parse(localStorage.getItem('finder_his_' + this.domainDataService.domainCode))
        if (his) {
            this.historyQuestions = his;
            this.changeDetect.detectChanges()
        }

        this.historyService.getHistorySubscription().subscribe(res => {
            console.log(res);
            if (res == true) {
                this.loadHistory()
            }
        });
    }
}