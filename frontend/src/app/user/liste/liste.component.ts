import { Component, OnInit } from '@angular/core';
import { ListToggleService } from './list-toggle.service';
import { UserService } from '../user.service'; 
import { CommonModule } from '@angular/common'; 
import { AddComponent } from '../add/add.component'; 
import { Router } from '@angular/router'; // 1. زدنا الـ Router هنا

@Component({
  selector: 'app-user-list',
  standalone: true, 
  imports: [CommonModule, AddComponent], 
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css']
})
export class UserListComponent implements OnInit {
  isListOpen = true; 
  users: any[] = [];
  isModalOpen = false;

  constructor(
    private listToggleService: ListToggleService,
    private userService: UserService,
    private router: Router // 2. دخلنا الـ Router في الـ Constructor
  ) { }

  ngOnInit(): void {
    this.loadUsers();

    this.listToggleService.isListOpen$.subscribe((status: boolean) => {
      this.isListOpen = status;
      if (status) {
        this.loadUsers(); 
      }
    });
  }

  // 3. الفانكشن هذي توة تولي تهزك للرابط اللي برمجناه في الـ Routing
  openAddModal() {
    this.router.navigate(['/admin/users/add']);
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs', err);
      }
    });
  }

  // هذي الفانكشن تقعد احتياط لو استعملت Modal مستقبلاً
  handleUserAdded(formData: any) {
    this.userService.createUser(formData).subscribe({
      next: () => {
        this.loadUsers(); 
        this.isModalOpen = false; 
      },
      error: (err) => console.error("Erreur d'ajout", err)
    });
  }
}