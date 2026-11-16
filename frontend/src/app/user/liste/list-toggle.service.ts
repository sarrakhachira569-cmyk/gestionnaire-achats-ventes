import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListToggleService {
  // الحالة متاع الـ Liste: مسكرة (false) في الأول
  private isListOpenSubject = new BehaviorSubject<boolean>(false);
  isListOpen$ = this.isListOpenSubject.asObservable();

  // ميثود تبدل الحالة (Toggle)
  toggleList() {
    this.isListOpenSubject.next(!this.isListOpenSubject.value);
  }

  // ميثود تسكر الـ Liste مباشرة
  closeList() {
    this.isListOpenSubject.next(false);
  }
}