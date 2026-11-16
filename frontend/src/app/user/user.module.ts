import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './liste/liste.component';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AddComponent } from './add/add.component';


@NgModule({
  declarations: [
    UserListComponent,
    ProfileComponent,
    EditProfileComponent,
    AddComponent
   
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    RouterModule,
  ]
})
export class UserModule { }
