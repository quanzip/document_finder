import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
    NgbToastModule, NgbProgressbarModule, NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';

import {PickerModule} from '@ctrl/ngx-emoji-mart';

import {FlatpickrModule} from 'angularx-flatpickr';
import {CountToModule} from 'angular-count-to';
import {NgApexchartsModule} from 'ng-apexcharts';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {SimplebarAngularModule} from 'simplebar-angular';

// Swiper Slider
import {SwiperModule} from 'ngx-swiper-wrapper';
import {SWIPER_CONFIG} from 'ngx-swiper-wrapper';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';

import {LightboxModule} from 'ngx-lightbox';

// Load Icons
import {defineLordIconElement} from 'lord-icon-element';
import lottie from 'lottie-web';

// Pages Routing
import {PagesRoutingModule} from "./pages-routing.module";
import {SharedModule} from "../shared/shared.module";
import {ChatClientComponent} from "./chat/chat-client/chat-client.component";
import {ChatClientModule} from "./chat/chat-client/chat-client.module";
import {ChatCloseComponent} from "./chat/chat-client/chat-close/chat-close.component";
import {SurveyResponseModule} from "./survey-click-view/survey-response.module";

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto'
};

@NgModule({
    declarations: [
        ChatClientComponent
    ],
    imports: [
        CommonModule,
        NgbTooltipModule,
        PickerModule,
        FormsModule,
        NgbToastModule,
        NgbProgressbarModule,
        FlatpickrModule.forRoot(),
        CountToModule,
        NgApexchartsModule,
        LeafletModule,
        NgbDropdownModule,
        SimplebarAngularModule,
        PagesRoutingModule,
        SharedModule,
        SwiperModule,
        LightboxModule,
        ChatClientModule,
        SurveyResponseModule
        // ChatClientModule,
    ],
    providers: [
        {
            provide: SWIPER_CONFIG,
            useValue: DEFAULT_SWIPER_CONFIG
        }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {
    constructor() {
        defineLordIconElement(lottie.loadAnimation);
    }
}
