import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategorieService } from '../categorie.service'; 

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html'
})
export class UpdateComponent implements OnInit {
  categorieId!: number;
  categorie: any = {}; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catService: CategorieService
  ) {}

  ngOnInit(): void {
    this.categorieId = this.route.snapshot.params['id'];
    
    this.catService.get_categorie(this.categorieId).subscribe(data => {
      this.categorie = data;
    });
  }

  onUpdate() {
    // --- التعديل اللي تفاهمنا فيه هنا ---
    
    // إذا الـ Admin رجع الـ is_active لـ true بيده في الـ Form
    if (this.categorie.is_active === true) {
      
      // نثبتوا في الحالة القديمة (قبل ما نبعثوا التعديل)
      if (this.categorie.status === 'ARRETE' || this.categorie.status === 'SUSPENDU') {
        
        // أوتوماتيكياً نصلحو الـ Status والـ Date مادام الـ Admin قرر يرجعها تخدم
        this.categorie.status = 'DISPONIBLE';
        this.categorie.deleted_at = null; 
      }
    }

    // نبعثوا التعديلات (سواء تبدلت الحالة أو مجرد تبديل إسم)
    this.catService.update_Categorie(this.categorieId, this.categorie).subscribe({
      next: () => {
        this.router.navigate(['/admin/categories']); 
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour", err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/categories']);
  }
}