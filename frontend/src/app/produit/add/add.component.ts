import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-produit',
  templateUrl: './add.component.html'
})
export class AddComponent implements OnInit {
  newProduit: any = {
    title: '',
    description: '',
    quantite_initial: null,
    quantite_restant: null,
    image: '', 
    prix_hors_tax: null,
    tva: 19,
    categorie_id: null 
  };

  categories: any[] = [];
  prix_ttc_display: number = 0;
  selectedFile: File | null = null;
  selectedFileName: string = 'Aucun fichier sélectionné';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<any[]>('http://127.0.0.1:8000/categories/list').subscribe(res => {
      this.categories = res.filter(c => c.is_active && c.status === 'DISPONIBLE');
    });
  }

  syncQuantities() {
    this.newProduit.quantite_restant = this.newProduit.quantite_initial;
  }

  calculateTTC() {
    if (this.newProduit.prix_hors_tax) {
      this.prix_ttc_display = this.newProduit.prix_hors_tax * (1 + (this.newProduit.tva || 0) / 100);
    } else {
      this.prix_ttc_display = 0;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.selectedFileName = this.selectedFile.name;
      this.newProduit.image = this.selectedFile.name;
    } else {
      this.selectedFileName = 'Aucun fichier sélectionné';
    }
  }

  onSubmit(form: any) {
    // التصليح هنا: نحينا شرط !this.selectedFile باش الفورم يتعدى حتى بلاش تصويرة
    if (form.invalid) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const formData = new FormData();
    
    formData.append('title', this.newProduit.title);
    formData.append('description', this.newProduit.description);
    formData.append('quantite_initial', (this.newProduit.quantite_initial ?? 0).toString());
    formData.append('quantite_restant', (this.newProduit.quantite_restant ?? this.newProduit.quantite_initial ?? 0).toString());
    formData.append('prix_hors_tax', (this.newProduit.prix_hors_tax ?? 0).toString());
    formData.append('tva', (this.newProduit.tva ?? 0).toString());
    formData.append('categorie_id', (this.newProduit.categorie_id ?? '').toString());
    
    // نبعث الملف فقط إذا كان موجود (بما إنو اختياري)
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); 
    }

    this.http.post('http://127.0.0.1:8000/produits/createproduit', formData)
      .subscribe({
        next: () => {
          console.log("Produit enregistré avec succès");
          this.router.navigate(['/admin/produits']);
        },
        error: (err) => {
          console.error("Erreur Backend", err);
          alert("Erreur lors de l'enregistrement: " + (err.error?.detail?.[0]?.msg || "Vérifiez les données"));
        }
      });
  }

  cancel() {
    this.router.navigate(['/admin/produits']);
  }
}