import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LanguageService } from '../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

// Component pages
import { LayoutComponent } from './layout.component';
import { VerticalComponent } from './vertical/vertical.component';



@NgModule({
    declarations: [
        LayoutComponent,
        VerticalComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbDropdownModule,
        NgbNavModule,
        SimplebarAngularModule,
        TranslateModule,
    ],
    exports: [
        LayoutComponent
    ],
    providers: [LanguageService]
})
export class LayoutsModule { }
