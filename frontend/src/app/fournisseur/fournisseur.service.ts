import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private apiUrl = 'http://localhost:8000/fournisseurs';

  constructor(private http: HttpClient) {}

  CreateFournisseur(data: any): Observable<any> {
    return this.http.post('http://localhost:8000/fournisseurs/', data);
  }

  getFournisseurs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/');
  }

  getFournisseur(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateFournisseur(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  // Soft Delete
  deleteFournisseur(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}