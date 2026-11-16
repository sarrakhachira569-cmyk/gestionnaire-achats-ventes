import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule} from '@angular/router';

import { AddComponent } from './add/add.component';
import { ListeComponent } from './liste/liste.component';
import { UpdateComponent } from './update/update.component';

@NgModule({
  declarations: [AddComponent, ListeComponent, UpdateComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    
  ]
})
export class VenteModule { }