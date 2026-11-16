import { Component, OnInit } from '@angular/core';
import { VenteService } from '../vente.service'; // تأكد من المسار
import { Router } from '@angular/router'; // 1. لازم نزيدو الـ Router باش نتعداو لصفحة أخرى
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liste-ventes',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css']
})
export class ListeComponent implements OnInit {
  ventes: any[] = [];
  filteredVentes: any[] = [];
  searchTerm: string = '';
  loading = true;

  constructor(private venteService: VenteService,private router: Router) { }

  ngOnInit(): void {
    this.fetchVentes();
  }
  // --- الـ Functions اللي كانو ناقصين وتسببو في الـ Error ---

  // تمشي لصفحة إضافة بيع جديدة
  goToAdd() {
    this.router.navigate(['/admin/ventes/add']); // حط الـ Path الصحيح اللي عندك في الـ AppRoutingModule
  }

  // تمشي لصفحة تعديل بيع موجودة
  goToEdit(id: number) {
    this.router.navigate(['/admin/ventes/update', id]); // حط الـ Path الصحيح
  }

  // -------------------------------------------------------

  fetchVentes() {
    this.loading = true;
    this.venteService.getAllVentes().subscribe({
      next: (data) => {
        this.ventes = data;
        this.filteredVentes = [...this.ventes];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Erreur', 'Impossible de charger les ventes', 'error');
      }
    });
  }

  updateSearch(event: any) {
    this.searchTerm = event.target.value;
    this.filterVentes();
  }

  filterVentes() {
  const search = this.searchTerm.toLowerCase().trim();
  if (!search) {
    this.filteredVentes = [...this.ventes];
    return;
  }

  // نثبتوا هل الـ search هو رقم برك؟
  const isNumber = /^\d+$/.test(search);

  this.filteredVentes = this.ventes.filter(v => {
    if (isNumber) {
      // كان كتبنا رقم، يلوج بالـ ID بالضبط وممنوع يلوج في الأسامي
      return v.id.toString() === search;
    } else {
      // كان كتبنا حروف، يلوج في الاسم واللقب والـ Produit
      const full1 = ((v.client_firstname || '') + ' ' + (v.client_lastname || '')).toLowerCase();
      const full2 = ((v.client_lastname || '') + ' ' + (v.client_firstname || '')).toLowerCase();
      return full1.includes(search) || 
             full2.includes(search) || 
             (v.produit_title && v.produit_title.toLowerCase().includes(search));
    }
  });
}

  onDelete(id: number): void {
    Swal.fire({
      title: 'Supprimer cette vente?',
      text: "Le stock sera réintégré et la vente sera marquée comme SUPPRIMÉE.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.venteService.deleteVente(id).subscribe({
          next: () => {
            // تحديث السطر في الـ Liste مباشرة كيما عملنا في الـ Produit
            const index = this.ventes.findIndex(v => v.id === id);
            if (index !== -1) {
              this.ventes[index].status = 'SUPPRIMEE';
              this.ventes[index].is_active = false;
              this.ventes[index].deleted_at = new Date().toISOString();
            }
            this.filterVentes();
            Swal.fire('Supprimée!', 'La vente a été archivée avec succès.', 'success');
          },
          error: (err) => {
            Swal.fire('Erreur', err.error.detail || 'Opération impossible', 'error');
          }
        });
      }
    });
  }
}