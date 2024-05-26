import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {defineLordIconElement} from "lord-icon-element";
import lottie from "lottie-web";
import {ConfirmationComponent} from "./confirmation.component";

@NgModule({
    imports: [],
    declarations: [ConfirmationComponent],
    exports: [ConfirmationComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfirmationModule {
    constructor() {
        defineLordIconElement(lottie.loadAnimation);
    }
}
