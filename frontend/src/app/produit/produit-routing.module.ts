import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';
import { ListeComponent } from './liste/liste.component';

const routes: Routes = [
  {path:"add-produit",component:AddComponent},
  {path:"update-produit",component:UpdateComponent},
  {path:"liste-produit",component:ListeComponent}

  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProduitRoutingModule { }
