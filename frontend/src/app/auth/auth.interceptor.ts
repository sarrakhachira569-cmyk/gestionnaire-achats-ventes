import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs'; // 🟢 زدنا EMPTY هنا
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(
    private router: Router, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  let token: string | null = null;
  const isBrowser = isPlatformBrowser(this.platformId);

  if (isBrowser) {
    token = localStorage.getItem('token');
  }

  // إذا الطلب ماشي للـ profile وما فماش Token، نخرجوا بسلام من غير 401
  if (req.url.includes('/users/me') && !token && isBrowser) {
    return EMPTY; 
  }

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next.handle(authReq).pipe(
  catchError((error: HttpErrorResponse) => {
    
    // 1. إذا بالحق الـ Token وفى (401) وإنت تلوج على الـ Profile
    if (error.status === 401 && req.url.includes('/users/me')) {
      if (isBrowser) {
        localStorage.removeItem('token');
      }
      this.router.navigate(['/login']);
      return EMPTY; // يوقف كل شيء ويخرج للـ Login
    }

    // 2. 🟢 هنا الفائدة: إذا صارت أي غلطة أخرى (400, 422, 500 أو حتى 401 في الـ Update)
    // نبعثوا الغلطة للـ Component باش تظهر الـ Swal.fire متاعك
    // وما نخرجوش مالصفحة
    return throwError(() => error);
  })
);
}
}