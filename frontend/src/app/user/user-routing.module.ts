import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './liste/liste.component';
import { ProfileComponent } from './profile/profile.component';



const routes: Routes = [
  {path:"liste-user",component:UserListComponent},
  {path:"profile-user",component:ProfileComponent},

  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
