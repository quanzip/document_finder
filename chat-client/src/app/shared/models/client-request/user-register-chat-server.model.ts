export class UserRegisterChatServerModel {
    clientId?: string;
    domainId?: string;
    serviceId?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    externalId?: string;
    userCode?: string;


    constructor(clientId: string, domainId: string, serviceId: string, name: string, email: string, phoneNumber: string) {
        this.clientId = clientId;
        this.domainId = domainId;
        this.serviceId = serviceId;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }
}