import { Component, OnInit } from '@angular/core';
import { ProduitService, ProduitResponse } from '../produit.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css']
})
export class ListeComponent implements OnInit {
  produits: ProduitResponse[] = [];
  filteredProduits: ProduitResponse[] = [];
  searchTerm: string = '';
  loading = true;
  backendUrl = 'http://127.0.0.1:8000';

  constructor(private produitService: ProduitService) { }

  ngOnInit(): void {
    this.fetchProduits();
  }

  fetchProduits() {
    this.loading = true;
    this.produitService.getAll().subscribe({
      next: (data: ProduitResponse[]) => {
        // --- تطبيق شروط الـ Backend اللي عطيتهم لي حرفياً ---
        this.produits = data.map(p => {
          // 1. شرط الـ Rupture stock
          if (p.quantite_restant !== null && p.quantite_restant === 0) {
            p.status = "RUPTURE";
            p.is_active = false;
          } 
          // 2. إذا السلعة كانت مقطوعة ورجعت، السيستيم يرجعها تخدم وحدو
          else if (p.quantite_restant !== null && p.quantite_restant > 0) {
            if (p.status === "RUPTURE") { 
                p.status = "DISPONIBLE";
                p.is_active = true;
            }
          }
          return p;
        });

        this.filteredProduits = [...this.produits];
        this.loading = false;
      },
      error: (err) => {
        console.error("Erreur chargement produits", err);
        this.loading = false;
        Swal.fire('Erreur', 'Impossible de charger les produits', 'error');
      }
    });
  }

  // هذي تخلي الـ البحث يصير في وقتو 100%
updateSearch(event: any) {
  this.searchTerm = event.target.value;
  this.filterProduits();
}
filterProduits() {
  const search = this.searchTerm.toLowerCase().trim();

  if (!search) {
    this.filteredProduits = [...this.produits];
    return;
  }

  // نثبتوا هل الـ search هو رقم برك؟ (يعني ID)
  const isNumber = /^\d+$/.test(search);

  this.filteredProduits = this.produits.filter(p => {
    if (isNumber) {
      // 1. كان كتبنا رقم: يلوج بالـ ID بالضبط وممنوع يلوج في الأسامي
      return p.id.toString() === search;
    } else {
      // 2. كان كتبنا حروف: يلوج في الإسم (Title)
      return p.title.toLowerCase().includes(search);
    }
  });
}

  onDelete(id: number): void {
    Swal.fire({
      title: 'Supprimer ce produit?',
      text: "Voulez-vous vraiment marquer ce produit comme supprimé ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      background: '#ffffff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.produitService.delete(id).subscribe({
          next: () => {
            const index = this.produits.findIndex(p => p.id === id);
            if (index !== -1) {
              // حسب الـ Backend الـ delete يرجعها ARRETE موش RUPTURE
              this.produits[index].deleted_at = new Date().toISOString();
              this.produits[index].status = 'ARRETE'; 
              this.produits[index].is_active = false;
            }
            
            this.filterProduits(); 
            
            Swal.fire({
              title: 'Désactivé!',
              text: 'Le produit a été marqué comme supprimé (ARRETE) avec succès.',
              icon: 'success',
              confirmButtonColor: '#6366f1'
            });
          },
          error: (err) => {
            console.error("Erreur lors de la suppression:", err);
            Swal.fire('Erreur', 'Impossible de supprimer le produit.', 'error');
          }
        });
      }
    });
  }
  // --- أضف هذا الكود في آخر الكلاس قبل القوس النهائي ---

 getStockColor(restant: number, initial: number): string {
  // 1. إذا السلعة وفات (0) -> أحمر طول
  if (restant <= 0) return 'bg-rose-600'; 

  const p = (restant / initial) * 100;

  // 2. إذا فايت الشطر (50% وأكثر) -> أخضر
  if (p >= 50) return 'bg-emerald-500';

  // 3. إذا تحت الشطر أما فوق الـ 20% -> أصفر/برتقالي
  if (p >= 20) return 'bg-amber-400';

  // 4. الباقي (يعني أقل من 20%) -> أحمر
  return 'bg-rose-500';
}
}