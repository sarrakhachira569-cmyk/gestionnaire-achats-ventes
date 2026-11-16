import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component'; 
import { MainLayoutComponent } from './main-layout/main-layout.component'; 
import { HomeComponent } from './home/home.component'; 

import { UserListComponent as UserList } from './user/liste/liste.component';
import { ProfileComponent } from './user/profile/profile.component';
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { AddComponent as UserAdd } from './user/add/add.component'; // سميناه UserAdd

import { ListeComponent as ProdList } from './produit/liste/liste.component';
import { AddComponent as ProdAdd } from './produit/add/add.component';
import { UpdateComponent as ProdUpdate } from './produit/update/update.component';

import { ListeComponent as CatList } from './categorie/liste/liste.component';
import { AddComponent as CatAdd } from './categorie/add/add.component';
import { UpdateComponent as CatUpdate } from './categorie/update/update.component';

import { ListeComponent as ClientList } from './client/liste/liste.component';
import { AddComponent as ClientAdd } from './client/add/add.component';
import { UpdateComponent as ClientUpdate } from './client/update/update.component';

import { ListeComponent as VenteList } from './vente/liste/liste.component';
import { AddComponent as VenteAdd } from './vente/add/add.component';
import { UpdateComponent as VenteUpdate } from './vente/update/update.component';

import { ListeComponent as AchatList } from './achat/liste/liste.component';
import { AddComponent as AchatAdd } from './achat/add/add.component';
import { UpdateComponent as AchatUpdate } from './achat/update/update.component';

import { ListeComponent as FournList } from './fournisseur/liste/liste.component';
import { AddComponent as FournAdd } from './fournisseur/add/add.component';
import { UpdateComponent as FournUpdate } from './fournisseur/update/update.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'profile/edit', component: EditProfileComponent },
      { path: 'profile', component: ProfileComponent },
      
      // الـ Users رجعوا يخدموا
      { path: 'users', component: UserList },
      { path: 'users/add', component: UserAdd }, // هذا هو اللي يخلي زرار Ajouter يخدم

      { path: 'produits', component: ProdList },
      { path: 'produits/add', component: ProdAdd },
      { path: 'produits/update/:id', component: ProdUpdate },

      { path: 'categories', component: CatList },
      { path: 'categories/add', component: CatAdd },
      { path: 'categories/update/:id', component: CatUpdate },

      { path: 'clients', component: ClientList },
      { path: 'clients/add', component: ClientAdd },
      { path: 'clients/update/:id', component: ClientUpdate },

      { path: 'ventes', component: VenteList },
      { path: 'ventes/add', component: VenteAdd },
      { path: 'ventes/update/:id', component: VenteUpdate },

      { path: 'achats', component: AchatList },
      { path: 'achats/add', component: AchatAdd },
      { path: 'achats/update/:id', component: AchatUpdate },

      { path: 'fournisseurs', component: FournList },
      { path: 'fournisseurs/add', component: FournAdd },
      { path: 'fournisseurs/update/:id', component: FournUpdate },

      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }