import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";

@Component({
    selector: 'app-confirmation',
    templateUrl: 'confirmation.component.html',
})
export class ConfirmationComponent {
    @Input() confirmMessage?: string;
    @Input() buttonText?: string;

    @Output() no = new EventEmitter();
    @Output() yes = new EventEmitter();
    @ViewChild('model') model!: ElementRef;

    onYesClick() {
        this.yes.emit(null);
    }

    onNoClick() {
        this.no.emit(null);
    }

}
