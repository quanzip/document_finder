export class ClientLoginRequestModel{
    serviceType: number;
    userType: number;
    userId: string;
    token: string;
    serviceId: number;
    realmId: number;


    constructor(serviceType: number, userType: number, userId: string, token: string, serviceId: number, realmId: number) {
        this.serviceType = serviceType;
        this.userType = userType;
        this.userId = userId;
        this.token = token;
        this.serviceId = serviceId;
        this.realmId = realmId;
    }
}
