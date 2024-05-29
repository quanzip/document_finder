import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Site } from '../models/site.model';

const baseUrl = 'http://localhost:8080/api/v1/sites';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  constructor(private http: HttpClient) { }
  getAll(): Observable<Site[]> {
    return this.http.get<Site[]>(baseUrl);
  }

  get(id: any): Observable<Site> {
    return this.http.get<Site>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/create`, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/update/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByName(name: any): Observable<Site[]> {
    return this.http.get<Site[]>(`${baseUrl}?siteName=${name}`);
  }
  generateScript(siteCode: string): Observable<any> {
    return this.http.get(`${baseUrl}/gen-script/${siteCode}`);
  }
}
