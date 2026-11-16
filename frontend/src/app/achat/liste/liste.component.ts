import { Component, OnInit } from '@angular/core';
import { AchatService } from '../achat.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liste-achats',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css']
})
export class ListeComponent implements OnInit {
  achats: any[] = [];
  filteredAchats: any[] = [];
  searchTerm: string = '';
  loading = true;

  constructor(private achatService: AchatService, private router: Router) { }

  ngOnInit(): void {
    this.fetchAchats();
  }

  fetchAchats() {
    this.loading = true;
    this.achatService.getAllAchats().subscribe({
      next: (data) => {
        this.achats = data;
        this.filteredAchats = [...this.achats];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateSearch(event: any) {
    this.searchTerm = event.target.value;
    this.filterAchats();
  }

  filterAchats() {
  const search = this.searchTerm.toLowerCase().trim();
  if (!search) {
    this.filteredAchats = [...this.achats];
    return;
  }

  const isNumber = /^\d+$/.test(search);

  this.filteredAchats = this.achats.filter(a => {
    if (isNumber) {
      return a.id.toString() === search;
    } else {
      const full1 = ((a.fournisseur_firstname || '') + ' ' + (a.fournisseur_lastname || '')).toLowerCase();
      const full2 = ((a.fournisseur_lastname || '') + ' ' + (a.fournisseur_firstname || '')).toLowerCase();
      return full1.includes(search) || 
             full2.includes(search) || 
             (a.produit_title && a.produit_title.toLowerCase().includes(search));
    }
  });
}

  onDelete(id: number): void {
    Swal.fire({
      title: 'Supprimer cet achat?',
      text: "🚨Attention: Le stock sera diminué. Cette opération sera bloquée si votre stock actuel est insuffisant pour couvrir cette suppression",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Oui, supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.achatService.deleteAchat(id).subscribe({
          next: () => {
            const index = this.achats.findIndex(a => a.id === id);
            if (index !== -1) {
              this.achats[index].status = 'SUPPRIMEE';
              this.achats[index].is_active = false;
              this.achats[index].deleted_at = new Date().toISOString();
            }
            this.filterAchats();
            Swal.fire('Supprimé!', 'L\'achat a été supprimé et le stock mis à jour.', 'success');
          },
          error: (err) => {
            Swal.fire('Erreur', err.error.detail || 'Action impossible', 'error');
          }
        });
      }
    });
  }

  goToAdd() { this.router.navigate(['/admin/achats/add']); }
  goToEdit(id: number) { this.router.navigate(['/admin/achats/update', id]); }
}