import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// Swiper Slider
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

// Counter
import { CountToModule } from 'angular-count-to';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

import {DatatableModule} from "./datatable/datatable.module";
import {ConfirmationModule} from "./confirmation/confirmation.module";
import {DatatableComponent} from "./datatable";
import {ConfirmationComponent} from "./confirmation/confirmation.component";
import {DisplayFileSizePipe} from "./pipe/display-file-size.pipe";

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    BreadcrumbsComponent,
    DisplayFileSizePipe
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    SwiperModule,
    CountToModule,

    DatatableModule,
    ConfirmationModule,
  ],
  exports: [BreadcrumbsComponent, DatatableComponent, ConfirmationComponent, DisplayFileSizePipe
  ]
})
export class SharedModule { }
