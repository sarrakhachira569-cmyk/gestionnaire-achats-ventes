import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VenteService {
  private apiUrl = 'http://127.0.0.1:8000/ventes';

  constructor(private http: HttpClient) {}

  getAllVentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  getVenteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createVente(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, data);
  }

  // الـ Update العادي
  updateVente(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  // إلغاء العملية (Annulation) - نبعثوا is_active = false
  annulerVente(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, { is_active: false });
  }

  // التفصيخ النهائي (Soft Delete)
  deleteVente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}