import { Component, OnInit } from '@angular/core';
import { FournisseurService } from '../fournisseur.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-liste-fournisseur',
  templateUrl: './liste.component.html'
})
export class ListeComponent implements OnInit {
  fournisseurs: any[] = [];
  filteredFournisseurs: any[] = []; 
  searchTerm: string = '';      
  loading = true;

  constructor(private fournisseurService: FournisseurService) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs() {
    this.loading = true;
    this.fournisseurService.getFournisseurs().subscribe({
      next: (data: any) => { 
        this.fournisseurs = data;
        this.filteredFournisseurs = data; 
        this.loading = false;
      },
      error: (err: any) => { 
        console.error('Erreur loading fournisseurs', err);
        this.loading = false;
      }
    });
  }

  filterFournisseurs() {
    const search = this.searchTerm.toLowerCase().trim();
    if (!search) {
      this.filteredFournisseurs = [...this.fournisseurs];
      return;
    }

    this.filteredFournisseurs = this.fournisseurs.filter(f => {
      const full1 = (f.firstname + ' ' + f.lastname).toLowerCase();
      const full2 = (f.lastname + ' ' + f.firstname).toLowerCase();
      return full1.includes(search) || 
            full2.includes(search) ||
            f.id.toString() === search 
  });
  }

  onDelete(id: number, name: string) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: `Voulez-vous vraiment supprimer le fournisseur ${name} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, Supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => { 
      if (result.isConfirmed) {
        this.fournisseurService.deleteFournisseur(id).subscribe({
          next: () => {
            this.loadFournisseurs(); 
            Swal.fire('Supprimé!', 'Le fournisseur a été marqué comme supprimé', 'success');
          }
        });
      }
    });
  }
}