import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-liste-client',
  templateUrl: './liste.component.html'
})
export class ListeComponent implements OnInit {
  clients: any[] = [];
  filteredClients: any[] = []; // زدنا هذه للفرز
  searchTerm: string = '';      // زدنا هذه للبحث
  loading = true;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: (data: any) => { 
        this.clients = data;
        this.filteredClients = data; // في الأول الزوز كيف كيف
        this.loading = false;
      },
      error: (err: any) => { 
        console.error('Erreur loading clients', err);
        this.loading = false;
      }
    });
  }

  // --- الهوني الخدمة الجديدة متاع البحث ---
  filterClients() {
    const search = this.searchTerm.toLowerCase().trim();
    if (!search) {
      this.filteredClients = [...this.clients];
      return;
    }

    this.filteredClients = this.clients.filter(c => {
      // نلصقو الاسم واللقب (الزوز احتمالات)
    const full1 = (c.firstname + ' ' + c.lastname).toLowerCase();
    const full2 = (c.lastname + ' ' + c.firstname).toLowerCase();
    return full1.includes(search) || 
           full2.includes(search) ||
           c.id.toString() === search // مقارنة تامة للـ ID باش ما يغلطش في أرقام التلفون
    });
  }

  onDelete(id: number, name: string) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: `Voulez-vous vraiment supprimer le client ${name} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, Supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => { 
      if (result.isConfirmed) {
        this.clientService.deleteClient(id).subscribe({
          next: () => {
            this.loadClients(); 
            Swal.fire('Supprimé!', 'Le client a été marqué comme supprimer', 'success');
          }
        });
      }
    });
  }
}