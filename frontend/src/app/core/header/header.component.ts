import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router'; 
import { UserService } from '../../user/user.service'; 
import { ProfileToggleService } from '../../user/profile/profile-toggle.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  backendUrl = "http://127.0.0.1:8000/images/";

  constructor(
    private userService: UserService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private profileToggleService: ProfileToggleService 
  ) {}

ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
      } else {
        this.getCurrentUser(); 
      }
    });
  }
}

  getCurrentUser() {
    this.userService.getProfile().subscribe({
      next: (data: any) => {
        this.currentUser = data;
        // نبعثوا البيانات الجديدة للـ Service باش الـ Subscription اللي الفوق تفيق بالتبديل
        this.userService.updateUser(data); 
        console.log("Utilisateur chargé dans le Header");
      },
      error: (err: any) => {
        console.error("Erreur Header:", err);
      }
    });
  }

  toggleProfileVisibility() {
    this.profileToggleService.toggle();
    if (this.router.url !== '/admin/profile') {
      this.router.navigate(['/admin/profile']);
    }
  }

  getAvatarUrl(): string {
    if (this.currentUser && this.currentUser.avatar) {
      return this.backendUrl + this.currentUser.avatar;
    }
    return this.backendUrl + 'default.jpg';
  }

  logout() {
  localStorage.clear(); // تفسخ التوكن وكل شيء مخبي
  this.userService.updateUser(null); // هذي أهم وحدة: تقول للـ Service راني خرجت، فرغ الـ Profile
  this.router.navigate(['/login']);
}
}