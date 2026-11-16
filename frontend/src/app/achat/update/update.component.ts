import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AchatService } from '../achat.service';
import { FournisseurService } from '../../fournisseur/fournisseur.service'; 
import { ProduitService } from '../../produit/produit.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-achat',
  templateUrl: './update.component.html'
})
export class UpdateComponent implements OnInit {
  achatId!: number;
  fournisseurs: any[] = [];
  produits: any[] = [];
  loading = true;
  
  achat: any = {
    fournisseur_id: null,
    produit_id: null,
    quantite: 1,
    prix_unitaire_ht: 0,
    tva_achat: 19,
    is_active: true
  };

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private achatService: AchatService,
    private fournisseurService: FournisseurService,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    this.achatId = +this.route.snapshot.params['id'];
    this.loadInitialData();
  }

  loadInitialData() {
    this.fournisseurService.getFournisseurs().subscribe(resFourns => {
      this.fournisseurs = resFourns;
      this.produitService.getAll().subscribe(resProds => {
        this.produits = resProds;
        this.achatService.getAchatById(this.achatId).subscribe({
          next: (data) => {
            if (!data.is_active || data.status === 'SUPPRIMEE') {
              Swal.fire('Attention', "Modification impossible : Cette achat est supprimée ou annulée. Pour corriger une information, veuillez effectuer une nouvelle opération d'achat.", 'warning');
              this.router.navigate(['/admin/achats']);
              return;
            }
            this.achat = data;
            this.fournisseurs = this.fournisseurs.filter(f => f.is_active || f.id === this.achat.fournisseur_id);
            this.loading = false;
          }
        });
      });
    });
  }

  // الـ faza اللي حاجتك بيها هنايا بضبط
  onProduitChange() {
    // نلوجو على المنتج الجديد اللي اختاره الـ Admin
    const selectedProd = this.produits.find(p => p.id === +this.achat.produit_id);
    if (selectedProd) {
      // نجبدو الـ HT والـ TVA من جدول المنتج ونصبوهم في الـ Achat
      // استعملت prix_hors_tax خاطر هذا هو الاسم اللي عندك في الـ Backend
      this.achat.prix_unitaire_ht = selectedProd.prix_hors_tax || selectedProd.prix_achat_ht || 0; 
      this.achat.tva_achat = selectedProd.tva || 19;
      // الـ Quantité تبقى هي بيدها باش الـ Admin ما يضيعش، وإلا حطها 1 إذا تحب
      this.achat.quantite = 1;
    }
  }

  get totalHT(): number {
    return (this.achat.quantite || 0) * (this.achat.prix_unitaire_ht || 0);
  }

  get totalTTC(): number {
    return this.totalHT * (1 + (this.achat.tva_achat || 0) / 100);
  }

  onUpdate() {
    Swal.fire({
      title: 'Confirmer la modification?',
      text: "Attention: Si vous diminuez la quantité ou annulez l'achat, le stock sera impacté. L'opération échouera si le stock actuel est insuffisant.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Oui, Modifier',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.achatService.updateAchat(this.achatId, this.achat).subscribe({
          next: () => {
            Swal.fire('Succès', 'Achat et stock mis à jour', 'success');
            this.router.navigate(['/admin/achats']);
          },
          error: (err) => Swal.fire('Erreur', err.error.detail || 'Erreur lors de la modification', 'error')
        });
      }
    });
  }
}