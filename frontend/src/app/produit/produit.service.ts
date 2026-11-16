import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProduitResponse {
  id: number;
  title: string;
  description: string;
  quantite_initial: number;
  quantite_restant: number;
  image: string;
  prix_hors_tax: number;
  prix_ttc: number;
  tva: number;
  categorie_id: number;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://127.0.0.1:8000/produits'; // بدلو حسب الـ URL متاعك

  constructor(private http: HttpClient) { }

  getAll(): Observable<ProduitResponse[]> {
    return this.http.get<ProduitResponse[]>(`${this.apiUrl}/`);
  }

// produit.service.ts
delete(id: number): Observable<any> {
  // جرب نحي كلمة /delete/ خاطر الـ Method DELETE وحدها تكفي
  // وإلا ثبت في الـ Main Route متاعك في الـ Python
  return this.http.delete(`${this.apiUrl}/${id}`); 
}
}