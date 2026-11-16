import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; 
import { FormsModule, NgForm } from '@angular/forms'; // 1. استيراد الـ FormsModule

@Component({
  selector: 'app-add',
  standalone: true, // 2. تأكد إنها true
  imports: [CommonModule, FormsModule], // 3. زيادة FormsModule هنا
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  
  @Output() userAdded = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  // 4. التأكد من وجود هذه المتغيرات داخل الكلاس
  newUser = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'admin'
  };

  selectedFile: File | null = null;
  showPassword = false;

  constructor(private location: Location) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // 5. التأكد من وجود هذه الدالة
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const formData = new FormData();
      formData.append('first_name', this.newUser.first_name);
      formData.append('last_name', this.newUser.last_name);
      formData.append('email', this.newUser.email);
      formData.append('password', this.newUser.password);
      formData.append('role', this.newUser.role);

      if (this.selectedFile) {
        formData.append('avatar', this.selectedFile);
      }

      this.userAdded.emit(formData); 
    } else {
      console.log("Formulaire invalide");
    }
  }

  cancel() {
    this.location.back(); 
  }
}