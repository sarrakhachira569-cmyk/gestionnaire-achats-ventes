import { Component, OnInit } from '@angular/core'; // زدت OnInit
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,           
  imports: [FormsModule, CommonModule, HttpClientModule] 
})
export class LoginComponent implements OnInit { // زدت implements OnInit
  loginData = { email: '', password: '' };
  isPasswordVisible: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  // هذي تضمن إن الـ Form ديما يبدا فارغ أول ما تحل الصفحة
  ngOnInit() {
    this.loginData = { email: '', password: '' };
  }

  onLogin() {
    console.log("Tentative de connexion..."); 
    
    const loginPayload = {
      email: this.loginData.email,
      password: this.loginData.password
    };

    this.http.post<any>('http://127.0.0.1:8000/users/login', loginPayload).subscribe({
      next: (response) => {
        if (response && response.access_token) {
          localStorage.setItem('token', response.access_token);
          console.log("Connexion réussie !");
          this.router.navigate(['/admin/home']); 
        }
      },
      error: (err) => {
        console.error("Erreur login:", err);
        if (err.status === 422) {
          alert("Erreur de format (422): ثبت في الـ Backend أو البيانات المرسلة");
        } else {
          alert("Email ou mot de passe incorrect");
        }
      }
    });
  }
}