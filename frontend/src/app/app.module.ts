import { NgModule, LOCALE_ID } from '@angular/core'; // زدت LOCALE_ID هنا
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule, registerLocaleData } from '@angular/common'; // زدت registerLocaleData هنا
import localeFr from '@angular/common/locales/fr'; // استيراد بيانات اللغة الفرنسية
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; 
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http'; 

// تسجيل اللغة الفرنسية في التطبيق
registerLocaleData(localeFr);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/auth.interceptor'; 
import { CoreModule } from './core/core.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HomeComponent } from './home/home.component';

import { ProfileComponent } from './user/profile/profile.component';
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { UserListComponent } from './user/liste/liste.component'; 

import { ClientModule } from './client/client.module';
import { ProduitModule } from './produit/produit.module';
import { VenteModule } from './vente/vente.module';
import { AchatModule } from './achat/achat.module';
import { CategorieModule } from './categorie/categorie.module';
import { FournisseurModule } from './fournisseur/fournisseur.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    EditProfileComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    CoreModule,
    HttpClientModule, 
    ClientModule,
    ProduitModule,
    VenteModule,
    AchatModule,
    CategorieModule,
    FournisseurModule,
    AuthModule,
    MainLayoutComponent,
    UserListComponent
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()), 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // السطر هذا هو اللي يخلي الـ Date تولي بالفرنسية في الـ App كاملة
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }