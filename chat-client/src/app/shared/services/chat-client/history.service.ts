import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs/Rx";

@Injectable({providedIn: 'root'})
export class HistoryService {
    private historySubject = new Subject();
    public getHistorySubscription(): Observable<any> {
        return this.historySubject.asObservable()
    }

    public startShowHistoryion(data: any) {
        this.historySubject.next(data)
    }
}