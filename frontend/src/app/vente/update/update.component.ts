import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VenteService } from '../vente.service';
import { ClientService } from '../../client/client.service';
import { ProduitService } from '../../produit/produit.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-vente',
  templateUrl: './update.component.html'
})
export class UpdateComponent implements OnInit {
  venteId!: number;
  clients: any[] = [];
  produits: any[] = [];
  loading = true;
  
  vente: any = {
    client_id: null,
    produit_id: null,
    quantite: 1,
    prix_unitaire_ht: 0,
    tva_vente: 19,
    is_active: true
  };

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private venteService: VenteService,
    private clientService: ClientService,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    this.venteId = +this.route.snapshot.params['id'];
    this.loadInitialData();
  }

  loadInitialData() {
    // 1. نجيبوا الحرفاء والمنتجات أولاً
    this.clientService.getClients().subscribe(resClients => {
      this.clients = resClients;

      this.produitService.getAll().subscribe(resProds => {
        this.produits = resProds;

        // 2. بعد ما نضمنوا أن القائمات تعباو، نجيبوا بيانات البيعة
        this.venteService.getVenteById(this.venteId).subscribe({
          next: (data) => {
            if (!data.is_active || data.status === 'SUPPRIMEE') {
              Swal.fire('Attention', "Modification impossible : Cette vente est supprimée ou annulée. Pour corriger une information, veuillez effectuer une nouvelle opération de vente.", 'warning');
              this.router.navigate(['/admin/ventes']);
              return;
            }
            this.vente = data;
            
            // فلترة القائمات باش نظهروا كان الـ Active + العنصر المختار حالياً
            this.clients = this.clients.filter(c => c.is_active || c.id === this.vente.client_id);
            this.produits = this.produits.filter(p => p.is_active || p.id === this.vente.produit_id);
            
            this.loading = false;
          }
        });
      });
    });
  }

  // تصليح الـ Auto-fill عند تغيير المنتج
  onProduitChange() {
    // الـ + تحول الـ ID من string لـ number باش الـ find تخدم مريغلة
    const selectedProd = this.produits.find(p => p.id === +this.vente.produit_id);
    
    if (selectedProd) {
      // تحديث البيانات أوتوماتيكياً
      this.vente.prix_unitaire_ht = selectedProd.prix_hors_tax; // ثبت اسم الحقل في الـ API متاعك (ممكن prix_ht)
      this.vente.tva_vente = selectedProd.tva || 19;
      
      // الملاحظة متاعك: نرجعوا الكمية لـ 1 كي يتبدل المنتج باش ما نبيعوش كمية كبيرة من منتج Stock متاعو فارغ
      this.vente.quantite = 1;
      
      console.log("Produit changé:", selectedProd.title, "Prix:", this.vente.prix_unitaire_ht);
    }
  }

  get totalHT(): number {
    return (this.vente.quantite || 0) * (this.vente.prix_unitaire_ht || 0);
  }

  get totalTTC(): number {
    return this.totalHT * (1 + (this.vente.tva_vente || 0) / 100);
  }

  onUpdate() {
    this.venteService.updateVente(this.venteId, this.vente).subscribe({
      next: () => {
        Swal.fire('Succès', 'Vente mise à jour avec succès', 'success');
        this.router.navigate(['/admin/ventes']);
      },
      error: (err) => Swal.fire('Erreur', err.error.detail || 'Erreur Backend', 'error')
    });
  }
}