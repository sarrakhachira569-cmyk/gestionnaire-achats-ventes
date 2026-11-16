import { Injectable } from '@angular/core'; // الإصلاح هنا
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8000/clients';

  constructor(private http: HttpClient) {}

  CreateClient(data: any): Observable<any> {
  return this.http.post('http://localhost:8000/clients/', data);
}

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/');
  }

  getClient(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  updateClient(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  // Soft Delete
  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}