import {HttpClient, HttpHeaders, HttpParameterCodec, HttpParams} from '@angular/common/http';
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {HTTP_STATUS_CODE} from "../../core/constant/system.constants";
import {ToastService} from "./toast-service";


export abstract class AbstractService {

    URL_SEPARATOR = '/';

    protected constructor(
        private httpClient: HttpClient,
        private toastService: ToastService,
        private translateService: TranslateService) {
    }

    abstract get SERVICE_URL(): string;

    public list(): Observable<any> {
        return this.getRequest(this.SERVICE_URL);
    }

    public get(id: string): Observable<any> {
        return this.getRequest(`${this.SERVICE_URL}/${id}`)
    }

    public update(id: string, object: any): Observable<any> {
        return this.postRequest(`${this.SERVICE_URL}/${id}`, JSON.stringify({data: object}))
    }

    public saveOrUpdate(object: any): Observable<any> {
        if (object.id) {
            return this.postRequest(`${this.SERVICE_URL}/${object.id}`, JSON.stringify({data: object}))
        } else {
            return this.putRequest(`${this.SERVICE_URL}`, JSON.stringify({data: object}));
        }
    }

    public delete(id: string): Observable<any> {
        return this.httpClient.delete(`${this.SERVICE_URL}/${id}`);
    }

    public getRequest(url: string, options?: any): Observable<any> {
        return this.httpClient.get(url, options).pipe(catchError(error => this.handleError(error)));
    }

    /**
     * make post request
     */
    public postRequest(url: string, data?: any): Observable<any> {
        return this.httpClient.post(url, data).pipe(catchError(error => this.handleError(error)));
    }

    /**
     * make post request with option
     */
    public postRequestWithOption(url: string, option: any, data?: any,): Observable<any> {
        return this.httpClient.post(url, data, option).pipe(catchError(error => this.handleError(error)));
    }

    /**
     * make put request
     */
    public putRequest(url: string, data?: any): Observable<any> {
        return this.httpClient.put(url, data).pipe(catchError(error => this.handleError(error)));
    }

    /**
     * make get request for file
     */
    public getRequestFile(url: string): Observable<any> {
        return this.httpClient.get(url, {responseType: 'blob', observe: 'response'}).pipe(catchError(error => this.handleError(error)));
    }

    /**
     * make post request for file
     */
    public postRequestFile(url: string, data?: any): Observable<any> {
        return this.httpClient.post(url, data, {responseType: 'blob'}).pipe(catchError(error => this.handleError(error)));
    }

    /**
     * make post request for file
     */
    public postRequestFile2(url: string, data?: any): Observable<any> {
        return this.httpClient.post(url, data, {
            responseType: 'blob',
            observe: 'response'
        }).pipe(catchError(error => this.handleError(error)));
    }

    /**
     * make get request
     */
    public deleteRequest(url: string, data?: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'}), body: data,
        };
        return this.httpClient.delete(url, httpOptions).pipe(catchError(error => this.handleError(error)));
    }

    /**
     * make patch request
     */
    public patchRequest(url: string, data?: any): Observable<any> {
        return this.httpClient.patch(url, data).pipe(catchError(error => this.handleError(error)));
    }

    /**
     * handleError
     */
    protected handleError(error: any) {
        if (error.url && !this.checkUrl(error.url)) {
            if (error.error?.message) {
                this.toastService.showDanger(error.error?.message);
            } else {
                switch (error.status) {
                    case HTTP_STATUS_CODE.BAD_REQUEST:
                        this.toastService.showDanger(this.translateService.instant("common.error.400"));
                        break;
                    case HTTP_STATUS_CODE.UNAUTHORIZED:
                        this.toastService.showDanger(this.translateService.instant("common.error.401"));
                        break;
                    case HTTP_STATUS_CODE.FORBIDDEN:
                        this.toastService.showDanger(this.translateService.instant("common.error.403"));
                        break;
                    case HTTP_STATUS_CODE.NOT_FOUND:
                        this.toastService.showDanger(this.translateService.instant("common.error.404"));
                        break;
                    case HTTP_STATUS_CODE.METHOD_NOT_ALLOWED:
                        this.toastService.showDanger(this.translateService.instant("common.error.405"));
                        break;
                    case HTTP_STATUS_CODE.NOT_ACCEPTABLE:
                        this.toastService.showDanger(this.translateService.instant("common.error.406"));
                        break;
                    case HTTP_STATUS_CODE.REQUEST_TIMEOUT:
                        this.toastService.showDanger(this.translateService.instant("common.error.408"));
                        break;
                    case HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR:
                        this.toastService.showDanger(this.translateService.instant("common.error.500"));
                        break;
                    case HTTP_STATUS_CODE.BAD_GATEWAY:
                        this.toastService.showDanger(this.translateService.instant("common.error.502"));
                        break;
                    case HTTP_STATUS_CODE.SERVICE_UNAVAILABLE:
                        this.toastService.showDanger(this.translateService.instant("common.error.503"));
                        break;
                    case HTTP_STATUS_CODE.GATEWAY_TIMEOUT:
                        this.toastService.showDanger(this.translateService.instant("common.error.504"));
                        break;
                }
            }
        }
        return throwError(error);
    }

    private noNotifyError: string[] = ['/api/v1/chat'];

    private checkUrl(url: string): boolean {
        for (let bypassUrl of this.noNotifyError) {
            let byPass = url.indexOf(bypassUrl)
            if (byPass >= 0) return true;
        }
        return false;
    }

    buildHttpParams(params: HttpParams, paramName: string, paramValues: any): HttpParams {
        if (!paramValues && paramValues !== false) {
            return params;
        }
        if (paramValues instanceof Array) {
            for (const item of paramValues) {
                params = params.append(paramName, item);
            }
        } else {
            params = params.append(paramName, paramValues + '');
        }
        return params;
    }

    public buildParams(obj: any): HttpParams {
        return Object.entries(obj || {})
            .reduce((params, [key, value]) => {
                if (value === null) {
                    return params.set(key, String(''));
                } else if (typeof value === typeof {}) {
                    return params.set(key, JSON.stringify(value));
                } else {
                    return params.set(key, String(value));
                }
            }, new HttpParams({encoder: new CustomEncoder()}));
    }
}

class CustomEncoder implements HttpParameterCodec {
    encodeKey(key: string): string {
        return encodeURIComponent(key);
    }

    encodeValue(value: string): string {
        return encodeURIComponent(value);
    }

    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }

    decodeValue(value: string): string {
        return decodeURIComponent(value);
    }
}
