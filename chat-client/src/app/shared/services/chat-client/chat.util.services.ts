import {Injectable} from '@angular/core';

@Injectable()
export class ChatUtil {

    static getParameterByName(key: string, queryString: string): string {
        const regex = new RegExp('[\\?&]' + key + '=([^&#]*)'),
            results = regex.exec(queryString);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    static nvl(priorityString: string, replaceString: string): string {
        return (priorityString == null || priorityString === undefined || priorityString === '') ? replaceString : priorityString;
    }

    static isEmpty(priorityString: string | null | undefined) {
        if ((priorityString == null || priorityString === undefined || priorityString === '')) {
            return true;
        }
        return false;
    }

    static newNvl(priorityString: any, replaceString: string) {
        if (priorityString === 'undefined') {
            priorityString = undefined;
        }
        return ChatUtil.nvl(priorityString, replaceString);

    }

    static getKeyByValue(object: { [x: string]: any; }, value: any) {
        return Object.keys(object).find(key => object[key] === value);
    }

    static checkCompatibility() {
        return !!('Notification' in window);
    }


    static isPermissionGranted(permission: string) {
        return permission === 'granted';
    }

}
