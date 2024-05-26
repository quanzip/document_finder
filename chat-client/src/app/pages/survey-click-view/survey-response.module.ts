import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {SurveyResponseComponent} from "./survey-response.component";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule
    ],
    declarations : [
        SurveyResponseComponent
    ]
})
export class SurveyResponseModule {
    constructor() {

    }
}