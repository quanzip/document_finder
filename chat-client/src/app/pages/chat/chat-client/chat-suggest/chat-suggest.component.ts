import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ChatClientModel} from "../../../../shared/models/chat-client/chat-client.model";
import {TranslateService} from "@ngx-translate/core";
import {DomainDataService} from "../../../../core/services/domain-data.service";
import {Subject} from "rxjs/Rx";
import {SuggestService} from "../../../../shared/services/chat-client/suggest.service";
import {ChangeDetection} from "@angular/cli/lib/config/workspace-schema";

@Component({
    selector: 'app-chat-suggest',
    templateUrl: './chat-suggest.html',
    styleUrls: ['./chat-suggest.css']
})

export class ChatSuggestComponent implements OnInit {
    @Input() chatModel: ChatClientModel = new ChatClientModel();
    @Input() openEvent: Subject<any> = new Subject();
    @Output() suggestEvent = new EventEmitter<any>()
    suggestList: any = []
    input: string = ''


    selectedSuggest: any;

    constructor(private trans: TranslateService, public domainDataService: DomainDataService, private suggestService: SuggestService) {
    }

    closeReply() {
        this.suggestEvent.emit();
    }

    selectSuggest(suggest: any) {
        this.suggestEvent.emit(suggest);
        // @ts-ignore
        let array: Array = JSON.parse(localStorage.getItem('finder_his_' + this.domainDataService.domainCode));
        if (!array || array.lengh == 0) {
            array = [];
            array.push(suggest.question)
        }else if (array.indexOf(suggest.question) < 0){
            array.push(suggest.question)
            if (array.length > 5) {
                array.splice(0, 1);
            }
        }
        localStorage.setItem('finder_his_' + this.domainDataService.domainCode, JSON.stringify(array));
    }

    loadSuggest(input: string, data: any) {
        this.input = input;
        this.suggestList = data;
    }

    boldText(question: string, section: string){
        return question.replace(section, `<b style="text-decoration: underline">${section}</b>`)
    }

    ngOnInit(): void {
        this.suggestService.getSuggestSubscription().subscribe(res => {
            this.loadSuggest(res.input, res.data)
        });
    }
}