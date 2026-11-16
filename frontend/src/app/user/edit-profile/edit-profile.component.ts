import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent implements OnInit {
  editForm: FormGroup;
  loading = false;
  message = '';
  showPassword = false;
  
  // 📸 متغيرات جديدة للصور
  selectedFile: File | null = null;
  avatarPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: [''],
      password: [''],
      is_active: [true] // 🟢 زدنا الـ is_active في الفورم
    });
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe(user => {
      this.editForm.patchValue({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_active: user.is_active // 🟢 نجيبو الحالة الحالية من الـ DB
      });
      this.avatarPreview = this.userService.getAvatarUrl(user.avatar);
    });
  }

  // 📸 ميثود كي تختار تصويرة من الـ PC
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // باش تظهر التصويرة فوراً قبل ما تعمل Save
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  getAvatarUrl() {
    return this.avatarPreview;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

 onSubmit() {
  this.loading = true;
  this.message = '';
  
  const formData = new FormData();
  
  // 1. نزيدو البيانات النصية (حوّل الـ values لـ string باش الـ FormData تقبلهم صح)
  formData.append('first_name', this.editForm.get('first_name')?.value || '');
  formData.append('last_name', this.editForm.get('last_name')?.value || '');
  formData.append('email', this.editForm.get('email')?.value || '');
  
  // 🟢 تصليح الـ is_active: لازم تتبعث "true" أو "false" كـ string
  formData.append('is_active', String(this.editForm.get('is_active')?.value));

  if(this.editForm.get('password')?.value) {
    formData.append('password', this.editForm.get('password')?.value);
  }

  // 🔴 التصليح الكبير هنا: 
  // لازم تستعمل إسم 'avatar' موش 'file' خاطر هذاكا إسم الحقل في الـ Backend
  if (this.selectedFile) {
    formData.append('avatar', this.selectedFile); 
  }

  this.userService.updateProfile(formData).subscribe({
    next: (res) => {
      this.loading = false;
      this.message = "Profil mis à jour avec succès ! ✅";
      setTimeout(() => this.router.navigate(['/admin/profile']), 1500);
    },
    error: (err) => { 
      this.loading = false; 
      this.message = "Erreur lors de la mise à jour.";
      console.error(err); // شوف الـ Console باش تعرف الـ Error بالظبط
    }
  });
}
}