import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Subscriber} from 'rxjs';
import {v4 as uuidv4} from 'uuid';
import {Response} from "../../shared/models/response.model";
import {UserGetResponseModel} from "../../shared/models/user-get-response.model";
import {UserModel} from "../../shared/models/user.model";
import {Observable} from "rxjs/Rx";
import {SERVICES} from "../../../environments/environment";
import {ConfigService} from "../../shared/services/config.service";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn: 'root'})
export class AuthenticationService {


    private readonly _realm: string;
    private readonly _domainId: number;

    private currentUserSubject: BehaviorSubject<UserModel> = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient, private configSvc: ConfigService) {
        this._realm = this.configSvc.realm;
        this._domainId = this.configSvc.domainId;
    }

    authUserInit(): Observable<boolean> {
        return new Observable((subscriber: Subscriber<boolean>) => {

            const onUserGetResponse = (user: UserModel) => {
                localStorage.setItem(`domain_${this._domainId}.clientId`, user.clientId);
                localStorage.setItem(`domain_${this._domainId}.userId`, user.id);
                localStorage.setItem(`domain_${this._domainId}.sessionToken`, user.sessionToken);

                this.currentUserSubject.next(user);
                subscriber.next(true);
                subscriber.complete();
            }

            if (this.userId && this.sessionToken) {
                this.getUserWithRetry().subscribe(res => onUserGetResponse(res.data.user), error => {
                    if (error.status == 401) {
                        this.logout();
                        this.registerNewUser(this._domainId).subscribe(res => onUserGetResponse(res.data.user), error => subscriber.error(error));
                    } else {
                        subscriber.error(error);
                        subscriber.complete();
                    }
                });
            } else {
                this.registerNewUser(this._domainId).subscribe(res => onUserGetResponse(res.data.user), error => subscriber.error(error));
            }
        });
    }

    private getUserWithRetry(): Observable<Response<UserGetResponseModel>> {
        return new Observable((subscriber: Subscriber<Response<UserGetResponseModel>>) => {
            let remainingRetries: number = 2;
            const getUserWithRetryOn401Error = () => {
                this.http.get<Response<UserGetResponseModel>>(`${SERVICES.CHAT_SERVER_API.url}/realms/${this.configSvc.realmId}/users/${this.userId}`, httpOptions).subscribe(res => {
                    subscriber.next(res);
                    subscriber.complete();
                }, error => {
                    if (error.status == 401) {
                        if (remainingRetries > 0) {
                            console.log(`Retry getting user due to 401 error, remaining retries: ${remainingRetries}`);
                            setTimeout(() => getUserWithRetryOn401Error(), 5000);
                            remainingRetries--;
                        } else {
                            subscriber.error(error);
                            subscriber.complete();
                        }
                    } else {
                        subscriber.error(error);
                        subscriber.complete();
                    }
                });
            }
            getUserWithRetryOn401Error();
        });
    }

    private registerNewUser(domainId: number): Observable<Response<UserGetResponseModel>> {
        const clientId = uuidv4().replace(/-/g, "");
        const body = {
            data: {
                intent: "conversation:start",
                client: {
                    id: clientId,
                    domainId: domainId
                }
            }
        };
        // Register Api
        return this.http.post<Response<UserGetResponseModel>>(`${SERVICES.CHAT_SERVER_API.url}/realms/${this.configSvc.realmId}/users`, body, httpOptions);
    }

    /**
     * Returns the current user */
    public currentUser(): any {
        this.currentUserSubject.getValue();
    }

    /**
     * Logout the user
     */
    logout() {
        localStorage.removeItem(`domain_${this._domainId}.clientId`);
        localStorage.removeItem(`domain_${this._domainId}.userId`);
        localStorage.removeItem(`domain_${this._domainId}.sessionToken`);
        this.currentUserSubject.next(null!);
    }

    get userId() {
        return this._domainId ? localStorage.getItem(`domain_${this._domainId}.userId`) : undefined;
    }

    get sessionToken() {
        return this._domainId ? localStorage.getItem(`domain_${this._domainId}.sessionToken`) : undefined;
    }

    get realm(): string {
        return this._realm;
    }

    get domainId(): number | undefined {
        return this._domainId;
    }
}

