import {Injectable, TemplateRef} from '@angular/core';
export type notificationType = 'info' | 'success' | 'danger' | 'warning' | 'NEW_TICKET' | 'ticket_expire_soon'
export type Toast = {
    textOrTpl: string | TemplateRef<any>,
    delay?: number,
    type: notificationType,
    extraData?: any
}

type NotificationOption = {
    delay?: number,
    type: notificationType,
    extraData?: any
}

@Injectable({providedIn: 'root'})
export class ToastService {
    toasts: Toast[] = [];

    show(textOrTpl: string | TemplateRef<any>, options: NotificationOption = {type: "info"}) {
        let toast: Toast = {textOrTpl, ...options};
        this.toasts.push(toast);
        return toast;
    }

    /**
     * Standard message
     */
    showInfo(content: string) {
        this.show(content, {delay: 10000, type: 'info'});
    }

    /**
     * Success message
     */
    showSuccess(content: string) {
        this.show(content, {delay: 10000, type: 'success'});
    }

    /**
     * Danger message
     */
    showDanger(content: string) {
        this.show(content, {delay: 10000, type: 'danger'});
    }

    /**
     * Warning message
     */
    showWarning(content: string) {
        this.show(content, {delay: 10000, type: 'warning'});
    }

    remove(toast: any) {
        this.toasts = this.toasts.filter(t => t !== toast);
    }
}
