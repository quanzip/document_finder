import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FileUploadService {

  private apiUrl = 'http://localhost:8080/api/v1/input';

  constructor(private http: HttpClient) { }

  uploadFile(documentUrl: string, siteId: number, multipartFile: File) {
    const formData = new FormData();
    formData.append('documentUrl', documentUrl);
    formData.append('siteId', siteId.toString());
    formData.append('multipartFile', multipartFile);

    return this.http.post<string>(this.apiUrl, formData);
  }
}
