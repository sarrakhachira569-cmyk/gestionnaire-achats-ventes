import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  // نثبتو اللي أحنا في المتصفح قبل ما نمسّو الـ localStorage
  let token: string | null = null;
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('token');
  }

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
  catchError((error: HttpErrorResponse) => {
    // 🛑 التعديل هنا: نثبتو إنها 401 "بالرسمي" ومش غلطة CORS (Status 0)
    // ونثبتو إنها جاية من طلب يحتاج Token بالرسمي
    if (error.status === 401 && !req.url.includes('/login')) {
      if (isPlatformBrowser(platformId)) {
        localStorage.removeItem('token');
      }
      router.navigate(['/login']);
    }
    return throwError(() => error);
  })
);
};