import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/auth.models';

@Injectable({providedIn: 'root'})
export class UserProfileService {
    // private _realmId : number = -1;
    // private _domainId: number = -1;
    // private _domainCode: string = '';
    private _userId: string = '';
    private _externalId: string = '';
    private _sessionToken: string = '';
    private _serviceId: string = '';
    private _serviceCode = '';
    private _userCode = '';

    private _name?: string = '';
    private _email?: string = '';
    private _phone?: string = '';
    private _role?: string = '';
    private _message?: string = '';
    private messagesInWait: string[] = [];

    saveDataClient(data: any) {
        this._name = data.name;
        this._email = data.email;
        this._phone = data.phone;
        this._message = data.message;
        this._serviceId = data.serviceId;
        this._serviceCode = data.serviceCode;
        this._externalId = data.externalId;
        this._userCode = data.userCode;
    }

    getDataClient() {
        return {
            name: this._name,
            email: this._email,
            phone: this._phone,
            message: this._message,
            serviceId: this._serviceId,
            serviceCode: this._serviceCode,
            externalId: this._externalId,
            userCode: this._userCode
        }
    }

    get role(): string {
        return this._role!;
    }

    set role(value: string) {
        this._role = value;
    }

    get name(): string {
        return this._name!;
    }

    set name(value: string) {
        this._name = value;
    }

    get email(): string {
        return this._email!;
    }

    set email(value: string) {
        this._email = value;
    }

    get phone(): string {
        return this._phone!;
    }

    set phone(value: string) {
        this._phone = value;
    }

    get userId(): string {
        return this._userId;
    }

    set userId(value: string) {
        this._userId = value;
    }

    get externalId(): string {
        return this._externalId;
    }

    set externalId(value: string) {
        this._externalId = value;
    }

     get userCode(): string {
        return this._userCode;
    }

    set userCode(value: string) {
        this._userCode = value;
    }

    get sessionToken(): string {
        return this._sessionToken;
    }

    set sessionToken(value: string) {
        this._sessionToken = value;
    }

    get serviceId(): string {
        return this._serviceId;
    }

    set serviceId(value: string) {
        this._serviceId = value;
    }


    get message(): string {
        return this._message!;
    }

    set message(value: string) {
        this._message = value;
    }


    get serviceCode(): string {
        return this._serviceCode;
    }

    set serviceCode(value: string) {
        this._serviceCode = value;
    }
}
