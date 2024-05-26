import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {SurveyDataModel} from "../../shared/models/survey/survey-data.model";
import {SurveyService} from "../../core/services/survey.service";
import {PROPERTIES} from "../../../environments/environment";

// declare the javascript function here
declare function doSurvey(p: SurveyDataModel): any;

@Component({
    selector: 'survey-response',
    templateUrl: "./survey-response.component.html",
    styleUrls: ["./survey-response.component.scss"]
})
export class SurveyResponseComponent implements OnInit {
    clientId = ""
    status = "";
    surveySubscription: Subscription | undefined;

    constructor(private activatedRoute: ActivatedRoute, private surveyService: SurveyService) {
        console.log("entered survey response")
    }

    ngOnInit() {
        let realmName = this.activatedRoute.snapshot.queryParamMap.get("realm")!
        let clientId = this.activatedRoute.snapshot.queryParamMap.get("clientId")!
        this.surveySubscription = this.surveyService.openSurveyPage(realmName, clientId).subscribe((result: any) => {
            if (result) {
                let data = result.data;
                if (data == 0) {
                    this.status = "NON_EXIST"
                } else if (data == 2) {
                    this.status = "DONE"
                } else if (data == 1) {
                    this.status = "EXPIRED"
                } else if (data.surveyClientId) {
                    console.log("Navigating to survey site...")

                    let surveyDataModel: SurveyDataModel = new SurveyDataModel();
                    surveyDataModel.serviceName = 'IPCC contact center';
                    surveyDataModel.style = {
                        width: 300,
                        height: 0
                    };
                    surveyDataModel.isdn = ['ipcc2.0'];
                    surveyDataModel.surveyName = 'Khảo sát nghiệp vụ IPCC 2.0';
                    surveyDataModel.forCampaign = 0;
                    surveyDataModel.bussinessId = PROPERTIES.surveyBusinessId;
                    surveyDataModel.channelSurvey = 'WEB';
                    surveyDataModel.listSurveyAtt = [
                        {
                            isdn: 'ipcc2.0',
                            surveyAtt: 'SME_SERVICE_TYPE',
                            surveyAttValue: 'Econtact'
                        }
                    ];
                    surveyDataModel.isNumber = 0;
                    surveyDataModel.identification = 1
                    doSurvey(surveyDataModel)
                }
            } else {
                this.status = "EXPIRED"
            }
        }, (error: any) => {
            this.status = "NON_EXIST"
            console.log("can not load survey link")
            console.log(error)
        })
    }
}