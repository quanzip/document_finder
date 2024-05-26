import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {AbstractService} from "../abstract.service";
import {ToastService} from "../toast-service";
import {SERVICES} from "../../../../environments/environment";
import {ChannelUploadType} from "../../../core/constant/constant";

@Injectable({providedIn: 'root'})
export class FileService extends AbstractService {

    constructor(private http: HttpClient, private toastSv: ToastService, private translate: TranslateService) {
        super(http, toastSv, translate);
    }

    get SERVICE_URL(): string {
        return `${SERVICES.CHAT_SERVICE_API.url}/api/v1/files`;
    }

    get SERVICE_URL_PUBLIC(): string {
        return `${SERVICES.CHAT_SERVICE_API.url}/public/api/v1/files`;
    }

    public getContentFile(filePath: string) {
        return this.getRequestFile(`${this.SERVICE_URL}/content?filePath=${filePath}`);
    }

    public getContentFilePublic(filePath: string, realmName: string) {
        return this.getRequestFile(`${this.SERVICE_URL_PUBLIC}/content?filePath=${filePath}&realmName=${realmName}`);
    }

    public getURLContentFilePublic(filePath: string, realmName: string) {
        return `${this.SERVICE_URL_PUBLIC}/content?filePath=${filePath}&realmName=${realmName}`;
    }

    public uploadFilesPublic(fileList: File[] | File, channelType: ChannelUploadType, realmName: string, serviceCode: string, serviceId: string, domainCode: string) {
        const formData = this.getFormData(fileList, channelType, realmName, serviceCode, serviceId, domainCode);
        return this.postRequest(this.SERVICE_URL_PUBLIC, formData);
    }

    private getFormData(fileList: File[]| File , channelType: ChannelUploadType, realmName: string, serviceCode: string, serviceId: string, domainCode: string) {
        const formData = new FormData();
        if(fileList instanceof File){
            formData.append('file', fileList);
        }else {
            for (let file of fileList) {
                formData.append('file', file);
            }
        }
        // formData.append('file', data);
        formData.append('channel', channelType);
        formData.append('realmName', realmName);
        formData.append('serviceCode', serviceCode);
        formData.append('serviceId', serviceId);
        formData.append('domainCode', domainCode);
        return formData;
    }
}
