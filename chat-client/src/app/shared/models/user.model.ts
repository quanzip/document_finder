export class UserModel {
    id: string;
    clientId: string;
    realmId: string;
    domainId?: number;
    sessionToken: string;
    role?: string;
    createdAt?: string;

    constructor(id: string, clientId: string, realmId: string, domainId: number, sessionToken: string) {
        this.id = id;
        this.clientId = clientId;
        this.realmId = realmId;
        this.domainId = domainId;
        this.sessionToken = sessionToken;
    }
}
