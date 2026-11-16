import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-produit',
  templateUrl: './update.component.html'
})
export class UpdateComponent implements OnInit {
  produitId: any;
  loading = false;
  backendUrl = 'http://localhost:8000';
  
  categories: any[] = [];

  produitData: any = {
    title: '',
    description: '',
    quantite_initial: 0,
    quantite_restant: 0,
    prix_hors_tax: 0,
    tva: 0,
    is_active: true,
    categorie_id: null
  };
  
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.produitId = this.route.snapshot.paramMap.get('id');
    this.fetchCategories();
    this.fetchProduit();
  }

  fetchCategories() {
    this.http.get<any[]>('http://127.0.0.1:8000/categories/list').subscribe({
      next: (res) => {
        // نفلترو الكاتيغوريات اللي يخدموا بركة
        this.categories = res.filter(c => c.is_active && c.status === 'DISPONIBLE');
      },
      error: (err) => console.error('Erreur loading categories', err)
    });
  }

  fetchProduit() {
    this.http.get(`${this.backendUrl}/produits/${this.produitId}`).subscribe({
      next: (data: any) => {
        this.produitData = data;
        if (data.image) {
          this.imagePreview = `${this.backendUrl}/images/${data.image}`;
        }
      },
      error: (err) => console.error('Erreur loading produit', err)
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onUpdate() {
    this.loading = true;
    const formData = new FormData();
    
    // إرسال البيانات
    formData.append('title', this.produitData.title);
    formData.append('description', this.produitData.description || '');
    formData.append('quantite_initial', this.produitData.quantite_initial.toString());
    formData.append('quantite_restant', this.produitData.quantite_restant.toString());
    formData.append('prix_hors_tax', this.produitData.prix_hors_tax.toString());
    formData.append('tva', this.produitData.tva.toString());
    
    // --- تطبيق الـ Principe متاعنا ---
    // نبعثوها كـ boolean حقيقي باش الـ Backend يشوفها "True" ويصلح الـ Status والـ deleted_at
    formData.append('is_active', JSON.stringify(this.produitData.is_active));
    
    if (this.produitData.categorie_id) {
      formData.append('categorie_id', this.produitData.categorie_id.toString());
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.http.patch(`${this.backendUrl}/produits/${this.produitId}`, formData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/produits']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Update failed', err);
      }
    });
  }
}