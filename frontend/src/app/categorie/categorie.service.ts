import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = 'http://127.0.0.1:8000/categories'; // ثبت في الـ Port متاع الـ Backend

  constructor(private http: HttpClient) { }

  // 1. جلب القائمة كاملة
  get_categories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`);
  }

  // 2. جلب كاتيكوري وحدة بالـ ID (مهمة ياسر للـ Update)
  get_categorie(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${id}`);
  }

  // 3. إضافة كاتيكوري جديدة
  CreateCategorie(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, data);
  }

  // 4. تحديث كاتيكوري (PATCH)
  update_Categorie(id: number, data: any): Observable<any> {
    // الـ Backend يتوقع PATCH ويقبل title, description, is_active
    return this.http.patch<any>(`${this.apiUrl}/update/${id}`, data);
  }

  // 5. حذف (Soft Delete)
  delete_Categorie(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
}