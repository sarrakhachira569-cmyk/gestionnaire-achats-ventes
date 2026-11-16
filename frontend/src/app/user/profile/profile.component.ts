import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'; 
import { isPlatformBrowser } from '@angular/common'; 
import { UserService } from '../user.service'; 
import { ProfileToggleService } from './profile-toggle.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  private backendUrl = "http://127.0.0.1:8000/images/";
  isProfileOpen = true; // 🟢 رديناها true كـ default باش تظهر الصفحة فوراً

  constructor(
    private userService: UserService,
    private profileToggleService: ProfileToggleService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { } 

  ngOnInit(): void {
  this.isProfileOpen = true; 

  this.profileToggleService.isOpen$.subscribe(status => {
    this.isProfileOpen = status;
  });

  if (isPlatformBrowser(this.platformId)) {
    // 🟢 السطر هذا هو اللي يخلي الـ Profile يتحدث فوراً أول ما تحل الصفحة
    this.loadUserProfile(); 

    this.userService.currentUser$.subscribe(data => {
      if (data) {
        this.user = data;
      }
      // نحينا الـ else خاطر نادينا للـ function الفوق
    });
  }
}

  loadUserProfile() {
    this.userService.getProfile().subscribe({
      next: (data: any) => { this.user = data; },
      error: (err: any) => { console.error("Erreur profile:", err); }
    });
  }

  getAvatarUrl(): string {
    if (this.user && this.user.avatar) return this.backendUrl + this.user.avatar;
    return this.backendUrl + 'default.jpg'; 
  }

  handleImageError(event: any) {
    event.target.src = this.backendUrl + 'default.jpg';
  }

  toggleProfile() {
    this.profileToggleService.toggle();
  }
}