import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-categorie',
  templateUrl: './liste.component.html'
})
export class ListeComponent implements OnInit {
  categories: any[] = [];
  filteredCategories: any[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.http.get<any[]>('http://127.0.0.1:8000/categories/list').subscribe({
      next: (res) => {
        this.categories = res;
        this.filteredCategories = res;
      },
      error: (err) => console.error("Erreur chargement categories", err)
    });
  }

filterCategories() {
  const search = this.searchTerm.toLowerCase().trim();

  if (!search) {
    this.filteredCategories = [...this.categories];
    return;
  }

  this.filteredCategories = this.categories.filter(c =>
    // لو يلقى الكلمة في العنوان
    c.title.toLowerCase().includes(search) ||
    // أو لو يلقى الرقم في الـ ID
    c.id.toString().includes(search)
  );
}

  goToAdd() {
    this.router.navigate(['/admin/categories/add']);
  }

  // تهزك لصفحة التعديل فقط، والقرار متاع "الترجيع" يصير داخل الفورم غاديك
  goToEdit(id: number) {
    this.router.navigate(['/admin/categories/update', id]);
  }

  deleteCategorie(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      this.http.delete(`http://127.0.0.1:8000/categories/delete/${id}`).subscribe({
        next: () => {
          this.fetchCategories(); // تتحدث القائمة وتولي الحالة ARRETE
        },
        error: (err) => alert("Erreur lors de la suppression")
      });
    }
  }
}