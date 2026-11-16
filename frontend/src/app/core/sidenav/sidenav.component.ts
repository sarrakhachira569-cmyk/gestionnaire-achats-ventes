import { Component } from '@angular/core';
import { ListToggleService } from '../../user/liste/list-toggle.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  isCollapsed: boolean = false;

  // زدنا الـ constructor والخدمة متاع الـ Toggle
  constructor(private listToggleService: ListToggleService) {}

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
  }

  // هذي الـ function الجديدة اللي باش نربطوها بالبوتون
  toggleUserList() {
    this.listToggleService.toggleList();
  }
}