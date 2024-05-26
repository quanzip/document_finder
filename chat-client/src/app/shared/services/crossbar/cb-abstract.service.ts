import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AbstractService} from "../abstract.service";
import {CbResponse} from "../../models/response.model";
import {catchError} from "rxjs/operators";
import {ToastService} from "../toast-service";
import {TranslateService} from "@ngx-translate/core";


export abstract class CbAbstractService extends AbstractService {

    constructor(private http: HttpClient, private _toastSvc: ToastService, private translateSvc: TranslateService) {
        super(http, _toastSvc, translateSvc);
    }

    public override list(filter?: { start_key?: any, paginate?: boolean, has_key?: boolean, has_value?: boolean, key_missing?: any, filter_owner_id?: any, filter_type?: any, filter_name?: any, page_size?: number }): Observable<CbResponse<any>> {
        let params = new HttpParams();
        if (filter) {
            params = this.buildHttpParams(params, 'start_key', filter.start_key);
            params = this.buildHttpParams(params, 'has_key', filter.has_key);
            params = this.buildHttpParams(params, 'has_value', filter.has_value);
            params = this.buildHttpParams(params, 'key_missing', filter.key_missing);
            params = this.buildHttpParams(params, 'filter_owner_id', filter.filter_owner_id);
            params = this.buildHttpParams(params, 'filter_type', filter.filter_type);
            params = this.buildHttpParams(params, 'filter_name', filter.filter_name);
            params = this.buildHttpParams(params, 'paginate', filter.paginate);
            params = this.buildHttpParams(params, 'page_size', filter.page_size);
        }
        return this.http.get<CbResponse<any>>(this.SERVICE_URL, {params: params}).pipe(catchError(error => this.handleError(error)));
    }

    public override get(id: string): Observable<CbResponse<any>> {
        return this.http.get<CbResponse<any>>(`${this.SERVICE_URL}/${id}`).pipe(catchError(error => this.handleError(error)));
    }

    public override saveOrUpdate(object: any): Observable<CbResponse<any>> {
        if (object.id) {
            return this.http.post<CbResponse<any>>(`${this.SERVICE_URL}/${object.id}`, JSON.stringify({data: object})).pipe(catchError(error => this.handleError(error)));
        } else {
            return this.http.put<CbResponse<any>>(`${this.SERVICE_URL}`, JSON.stringify({data: object})).pipe(catchError(error => this.handleError(error)));
        }
    }

    public patch(id: string, object: any): Observable<CbResponse<any>> {
        return this.http.patch<CbResponse<any>>(`${this.SERVICE_URL}/${id}`, JSON.stringify({data: object})).pipe(catchError(error => this.handleError(error)));
    }

    public override delete(id: string): Observable<CbResponse<any>> {
        return this.http.delete<CbResponse<any>>(`${this.SERVICE_URL}/${id}`).pipe(catchError(error => this.handleError(error)));
    }

    /*public deleteByOwner(ownerId: string): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            let count = 0;
            this.list({paginate: false, filter_owner_id: ownerId}).subscribe(
                res => {
                    const retValue = {error: 0, successList: [], failList: []};
                    if (res.data.length === 0) {
                        observer.next(retValue);
                        observer.complete();
                    } else {
                        res.data.forEach((obj) =>
                            this.delete(obj.id).subscribe(
                                res2 => {
                                    retValue.successList.push(obj.id);
                                },
                                error => {
                                    retValue.error = retValue.error + 1;
                                    retValue.failList.push({id: obj.id, error: error});
                                },
                                () => {
                                    count += 1;
                                    if (count === res.data.length) {
                                        observer.next(retValue);
                                        observer.complete();
                                    }
                                }
                            )
                        );
                    }
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }

    public unassignOwner(ownerId: string): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            let count = 0;
            this.list({paginate: false, filter_owner_id: ownerId}).subscribe(
                res => {
                    const retValue = {error: 0, successList: [], failList: []};
                    if (res.data.length === 0) {
                        observer.next(retValue);
                        observer.complete();
                    } else {
                        res.data.forEach((summary) => {
                            this.get(summary.id).subscribe(
                                res2 => {
                                    const obj = res2.data;
                                    delete obj['owner_id'];
                                    this.saveOrUpdate(obj).subscribe(
                                        res3 => {
                                            retValue.successList.push(obj.id);
                                        },
                                        error => {
                                            retValue.error = retValue.error + 1;
                                            retValue.failList.push({id: obj.id, error: error});
                                        },
                                        () => {
                                            count += 1;
                                            if (count === res.data.length) {
                                                observer.next(retValue);
                                                observer.complete();
                                            }
                                        }
                                    );
                                },
                                error => {
                                    retValue.error = retValue.error + 1;
                                    retValue.failList.push({id: summary.id, error: error});
                                    count += 1;
                                    if (count === res.data.length) {
                                        observer.next(retValue);
                                        observer.complete();
                                    }
                                }
                            );
                        });
                    }
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }*/

    abstract override get SERVICE_URL(): string;
}
