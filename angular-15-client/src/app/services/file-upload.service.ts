import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FileUploadService {

  private apiUrl = 'http://localhost:8080/api/v1/input';

  constructor(private http: HttpClient) { }

  uploadFile(documentUrl: string, id: number, multipartFile: File, siteCode1?: string) {
    const formData = new FormData();
    formData.append('documentUrl', documentUrl);
    formData.append('id', id.toString());
    formData.append('siteCode', siteCode1!!);
    formData.append('multipartFile', multipartFile);

    return this.http.post<string>(this.apiUrl, formData);
  }
}
