import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component pages
import {ChatClientComponent} from "./chat/chat-client/chat-client.component";
import {ChatCloseComponent} from "./chat/chat-client/chat-close/chat-close.component";
import {SurveyResponseComponent} from "./survey-click-view/survey-response.component";

const routes: Routes = [
    {
        path: "chat-client/:domain",
        component: ChatClientComponent
    }, {
        path: "chat-client/close/:domain",
        component: ChatCloseComponent
    },{
        path: "survey-response",
        component: SurveyResponseComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
