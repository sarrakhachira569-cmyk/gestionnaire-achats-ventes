import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-vente',
  templateUrl: './add.component.html'
})
export class AddComponent implements OnInit {
  newVente: any = {
    client_id: null,
    produit_id: null,
    quantite: 1,
    prix_unitaire_ht: null, 
    tva_vente: null        
  };

  clients: any[] = [];
  produits: any[] = [];
  selectedProduit: any = null; 
  prix_total_display: number = 0;
  prix_unit_ttc_display: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadClients();
    this.loadProduits();
  }

  loadClients() {
    this.http.get<any[]>('http://127.0.0.1:8000/clients/').subscribe(res => {
      // 🛡️ التعديل هنا: نظهروا كان الحريف الـ Active باش ما نبيعوش لواحد مبلوكي
      this.clients = res.filter(c => c.is_active === true); 
    });
  }

  loadProduits() {
    this.http.get<any[]>('http://127.0.0.1:8000/produits/').subscribe(res => {
      // 🛡️ التعديل هنا: نظهروا كان السلعة الموجودة (DISPONIBLE) والـ Active
      // والكمية متاعها أكبر من 0
      this.produits = res.filter(p => 
        p.is_active === true && 
        p.status === 'DISPONIBLE' && 
        p.quantite_restant > 0
      ); 
    });
  }

  calculateTotal() {
  this.selectedProduit = this.produits.find(p => p.id === this.newVente.produit_id);

  if (this.selectedProduit) {
    // 🛡️ التعديل: نصبوا القيم طول في الـ Model باش الـ Input يتعبى
    // ونستعملوا "||" باش نضمنوا إنو الـ valeur موش null
    if (this.newVente.prix_unitaire_ht === null || this.newVente.prix_unitaire_ht === undefined) {
      this.newVente.prix_unitaire_ht = this.selectedProduit.prix_hors_tax;
    }
    
    if (this.newVente.tva_vente === null || this.newVente.tva_vente === undefined) {
      this.newVente.tva_vente = this.selectedProduit.tva || 0;
    }

    // الحسابات توة تولي أدق ومربوطة بالـ Input
    const ht = (this.newVente.prix_unitaire_ht >= 0) ? this.newVente.prix_unitaire_ht : 0;
    const tva = (this.newVente.tva_vente >= 0) ? this.newVente.tva_vente : 0;
    
    this.prix_unit_ttc_display = ht * (1 + (tva / 100));
    this.prix_total_display = this.prix_unit_ttc_display * (this.newVente.quantite || 0);
  }
}

  onSubmit(form: any) {
    if (form.invalid) return;

    // تثبت بسيط قبل ما تبعث للـ Backend (اختياري أما باهي للـ UX)
    if (this.selectedProduit && this.newVente.quantite > this.selectedProduit.quantite_restant) {
       Swal.fire({
          title: 'Stock insuffisant !',
          text: `Il reste seulement ${this.selectedProduit.quantite_restant} pièces.`,
          icon: 'warning',
          confirmButtonColor: '#10b981',
          customClass: { popup: 'rounded-[2rem]' }
       });
       return;
    }

    this.http.post('http://127.0.0.1:8000/ventes/create', this.newVente).subscribe({
      next: () => {
        Swal.fire({
          title: 'Succès !',
          text: 'La vente a été enregistrée avec succès',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-[2rem]'
          }
        }).then(() => {
          this.router.navigate(['/admin/ventes']);
        });
      },
      error: (err) => {
        // إذا الـ Backend رجع Erreur (مثلا السلعة وفات في اللحظة هذيك)
        Swal.fire({
          title: 'Erreur',
          text: err.error.detail || 'Vérifiez les données saisies',
          icon: 'error',
          confirmButtonColor: '#10b981',
          customClass: {
            popup: 'rounded-[2rem]'
          }
        });
      }
    });
  }

  cancel() { this.router.navigate(['/admin/ventes']); }
}