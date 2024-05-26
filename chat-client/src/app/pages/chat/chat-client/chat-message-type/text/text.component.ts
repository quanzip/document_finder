import {Component, Input, OnInit} from "@angular/core";
import {Utils} from "../../../../../shared/utils";
import {SERVICES} from "../../../../../../environments/environment";

class ContentType {
    type?: string;
    content?: string
}

@Component({
    selector: 'mess-content',
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {
    @Input() mess: any | undefined;
    contentByTypes: ContentType[] = [];
    hasLink = false;

    public messageType = {
        TEXT: 1,
        SURVEY: 27,
    }

    ngOnInit(): void {
        let roughContent = this.mess.content;
        if (roughContent && roughContent.match(Utils.getRegexPhoneAndEmailAndUrl())){
            this.hasLink = true;
            this.splitText(roughContent);
        }else {
            this.contentByTypes.push(roughContent)
            this.hasLink = false;
        }
    }

    loadSurvey(surveyObject: any) {
        window.open(`${SERVICES.APP_IPCC_URL.url}/survey-response?realm=${surveyObject.realmName}&clientId=${surveyObject.clientId}`, 'blank');
    }

    truncateSurveyText(content: string) {
        let index = content.indexOf("http://");
        if (index < 0) index = content.indexOf("https://");

        if (index > 0) {
            return content.substring(0, index);
        } else return content;
    }

    splitText(text: string = "") {
        let normalStringIndex = 0;

        text.replace(Utils.getRegexPhoneAndEmailAndUrl(), (match, ...args) => {
            let offset = args[args.length - 3]
            let groups = args[args.length - 1];

            if (offset > 0 && normalStringIndex < offset) {
                let normalStringPart: ContentType = {
                    type: "TEXT",
                    content: text.substring(normalStringIndex, offset)
                }
                this.contentByTypes.push(normalStringPart)
            }
            normalStringIndex = offset + match.length


            if (groups.link) {
                let linkPart: ContentType = { type: "LINK", content: match}
                this.contentByTypes.push(linkPart)

            }
            return match
        });

        if (normalStringIndex < text.length) {
            let normalStringPart: ContentType = {
                type: "TEXT",
                content: text.substring(normalStringIndex, text.length)
            }
            this.contentByTypes.push(normalStringPart)
        }
    }

}
