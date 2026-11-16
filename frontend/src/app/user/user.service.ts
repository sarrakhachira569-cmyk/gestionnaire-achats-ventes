import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // الرابط الأساسي للـ Users
  private apiUrl = 'http://127.0.0.1:8000/users'; 
  private imagesUrl = 'http://127.0.0.1:8000/images/';

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) { }

  private getAuthHeaders() {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || localStorage.getItem('access_token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAvatarUrl(avatarName: string | undefined): string {
    if (!avatarName || avatarName === 'default.jpg' || avatarName.includes('téléchargement')) {
      return this.imagesUrl + 'default.jpg'; 
    }
    return this.imagesUrl + avatarName;
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  // ✅ نزيدو الـ Method هذي باش الـ Header يخدم من غير Error
  updateUser(user: any) {
    this.currentUserSubject.next(user);
  }

  updateProfile(formData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/me`, formData, { headers: this.getAuthHeaders() }).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`, { headers: this.getAuthHeaders() }); 
  }

  createUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, formData, { headers: this.getAuthHeaders() });
  }
}