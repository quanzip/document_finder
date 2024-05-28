import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs/Rx";

@Injectable({providedIn: 'root'})
export class SuggestService {
    private suggestSubject = new Subject();
    public getSuggestSubscription(): Observable<any> {
        return this.suggestSubject.asObservable()
    }

    public startShowSuggestion(data: any) {
        this.suggestSubject.next(data)
    }
}