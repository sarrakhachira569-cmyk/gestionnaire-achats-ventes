import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-categorie',
  templateUrl: './add.component.html'
})
export class AddComponent {
  newCategorie: any = {
    title: '',
    description: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(form: any) {
    if (form.invalid) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    this.http.post('http://127.0.0.1:8000/categories/create', this.newCategorie)
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/categories']);
        },
        error: (err) => {
          console.error("Erreur Backend", err);
          alert("Erreur lors de la création de la catégorie.");
        }
      });
  }

  cancel() {
    this.router.navigate(['/admin/categories']);
  }
}