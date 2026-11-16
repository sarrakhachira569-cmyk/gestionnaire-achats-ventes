import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-achat',
  templateUrl: './add.component.html'
})
export class AddComponent implements OnInit {
  newAchat: any = {
    fournisseur_id: null,
    produit_id: null,
    quantite: 1,
    prix_unitaire_ht: null, 
    tva_achat: null        
  };

  fournisseurs: any[] = [];
  produits: any[] = [];
  selectedProduit: any = null; 
  prix_total_display: number = 0;

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadFournisseurs();
    this.loadProduits();
  }

  loadFournisseurs() {
    this.http.get<any[]>('http://127.0.0.1:8000/fournisseurs/').subscribe(res => {
      this.fournisseurs = res.filter(f => f.is_active === true);
    });
  }

  loadProduits() {
  this.http.get<any[]>('http://127.0.0.1:8000/produits/').subscribe(res => {
    // نحينا الـ filter(p => p.is_active === true) باش يظهروا الكل
    this.produits = res; 
  });
}

  calculateTotal() {
    this.selectedProduit = this.produits.find(p => p.id === this.newAchat.produit_id);
    
    if (this.selectedProduit) {
      if (this.newAchat.prix_unitaire_ht === null || this.newAchat.prix_unitaire_ht === '') {
        this.newAchat.prix_unitaire_ht = this.selectedProduit.prix_hors_tax;
      }
      if (this.newAchat.tva_achat === null || this.newAchat.tva_achat === '') {
        this.newAchat.tva_achat = this.selectedProduit.tva || 0;
      }

      const ht = Number(this.newAchat.prix_unitaire_ht) || 0;
      const tva = Number(this.newAchat.tva_achat) || 0;
      const qte = Number(this.newAchat.quantite) || 0;
      
      const ttc = ht * (1 + (tva / 100));
      this.prix_total_display = ttc * qte;

      this.cdr.detectChanges(); 
    }
  }

 onSubmit(form: any) {
  if (form.invalid) return;

  // 🛠️ هنا السر: نحولو كل شي لـ Number قبل ما نبعثو
  const cleanData = {
    fournisseur_id: Number(this.newAchat.fournisseur_id),
    produit_id: Number(this.newAchat.produit_id),
    quantite: Number(this.newAchat.quantite),
    prix_unitaire_ht: this.newAchat.prix_unitaire_ht !== null ? Number(this.newAchat.prix_unitaire_ht) : 0,
    tva_achat: this.newAchat.tva_achat !== null ? Number(this.newAchat.tva_achat) : 0
  };

  console.log("Data sending to Backend:", cleanData);

  this.http.post('http://127.0.0.1:8000/achats/create', cleanData).subscribe({
    next: () => {
      Swal.fire({
        title: 'Achat Réussi !',
        text: 'Le stock a été mis à jour.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-[2rem]' }
      }).then(() => this.router.navigate(['/admin/achats']));
    },
    error: (err) => {
      console.error("Backend Response:", err.error); // شوف الـ Console تو تلقى التفاصيل
      Swal.fire({
        title: 'Erreur',
        text: err.error?.detail?.[0]?.msg || err.error?.detail || 'Vérifiez les données',
        icon: 'error',
        confirmButtonColor: '#4f46e5',
        customClass: { popup: 'rounded-[2rem]' }
      });
    }
  });
}

  cancel() { this.router.navigate(['/admin/achats']); }
}