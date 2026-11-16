import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurService } from '../fournisseur.service'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-fournisseur',
  templateUrl: './update.component.html'
})
export class UpdateComponent implements OnInit {
  fournisseurId: any; 
  loading = false;
  showModal = false;
  searchText = '';

    allCountries = [
    { name: 'Tunisie', code: '+216', short: 'tn' },
    { name: 'Algérie', code: '+213', short: 'dz' },
    { name: 'Andorre', code: '+376', short: 'ad' },
    { name: 'Angola', code: '+244', short: 'ao' },
    { name: 'Antigua-et-Barbuda', code: '+1268', short: 'ag' },
    { name: 'Argentine', code: '+54', short: 'ar' },
    { name: 'Arménie', code: '+374', short: 'am' },
    { name: 'Australie', code: '+61', short: 'au' },
    { name: 'Autriche', code: '+43', short: 'at' },
    { name: 'Azerbaïdjan', code: '+994', short: 'az' },
    { name: 'Bahamas', code: '+1242', short: 'bs' },
    { name: 'Bahreïn', code: '+973', short: 'bh' },
    { name: 'Bangladesh', code: '+880', short: 'bd' },
    { name: 'Barbade', code: '+1246', short: 'bb' },
    { name: 'Biélorussie', code: '+375', short: 'by' },
    { name: 'Belgique', code: '+32', short: 'be' },
    { name: 'Belize', code: '+501', short: 'bz' },
    { name: 'Bénin', code: '+229', short: 'bj' },
    { name: 'Bhoutan', code: '+975', short: 'bt' },
    { name: 'Bolivie', code: '+591', short: 'bo' },
    { name: 'Bosnie-Herzégovine', code: '+387', short: 'ba' },
    { name: 'Botswana', code: '+267', short: 'bw' },
    { name: 'Brésil', code: '+55', short: 'br' },
    { name: 'Brunei', code: '+673', short: 'bn' },
    { name: 'Bulgarie', code: '+359', short: 'bg' },
    { name: 'Burkina Faso', code: '+226', short: 'bf' },
    { name: 'Burundi', code: '+257', short: 'bi' },
    { name: 'Cap-Vert', code: '+238', short: 'cv' },
    { name: 'République centrafricaine', code: '+236', short: 'cf' },
    { name: 'Tchad', code: '+235', short: 'td' },
    { name: 'Chili', code: '+56', short: 'cl' },
    { name: 'Chine', code: '+86', short: 'cn' },
    { name: 'Colombie', code: '+57', short: 'co' },
    { name: 'Comores', code: '+269', short: 'km' },
    { name: 'Congo', code: '+242', short: 'cg' },
    { name: 'Costa Rica', code: '+506', short: 'cr' },
    { name: 'Côte d\'Ivoire', code: '+225', short: 'ci' },
    { name: 'Croatie', code: '+385', short: 'hr' },
    { name: 'Cuba', code: '+53', short: 'cu' },
    { name: 'Chypre', code: '+357', short: 'cy' },
    { name: 'République tchèque', code: '+420', short: 'cz' },
    { name: 'Danemark', code: '+45', short: 'dk' },
    { name: 'Djibouti', code: '+253', short: 'dj' },
    { name: 'Dominique', code: '+1767', short: 'dm' },
    { name: 'République dominicaine', code: '+1809', short: 'do' },
    { name: 'Équateur', code: '+593', short: 'ec' },
    { name: 'Égypte', code: '+20', short: 'eg' },
    { name: 'Salvador', code: '+503', short: 'sv' },
    { name: 'Guinée équatoriale', code: '+240', short: 'gq' },
    { name: 'Érythrée', code: '+291', short: 'er' },
    { name: 'Estonie', code: '+372', short: 'ee' },
    { name: 'Eswatini', code: '+268', short: 'sz' },
    { name: 'Éthiopie', code: '+251', short: 'et' },
    { name: 'Fidji', code: '+679', short: 'fj' },
    { name: 'Finlande', code: '+358', short: 'fi' },
    { name: 'France', code: '+33', short: 'fr' },
    { name: 'Gabon', code: '+241', short: 'ga' },
    { name: 'Gambie', code: '+220', short: 'gm' },
    { name: 'Géorgie', code: '+995', short: 'ge' },
    { name: 'Allemagne', code: '+49', short: 'de' },
    { name: 'Ghana', code: '+233', short: 'gh' },
    { name: 'Grèce', code: '+30', short: 'gr' },
    { name: 'Grenade', code: '+1473', short: 'gd' },
    { name: 'Guatemala', code: '+502', short: 'gt' },
    { name: 'Guinée', code: '+224', short: 'gn' },
    { name: 'Guinée-Bissau', code: '+245', short: 'gw' },
    { name: 'Guyana', code: '+592', short: 'gy' },
    { name: 'Haïti', code: '+509', short: 'ht' },
    { name: 'Honduras', code: '+504', short: 'hn' },
    { name: 'Hongrie', code: '+36', short: 'hu' },
    { name: 'Islande', code: '+354', short: 'is' },
    { name: 'Inde', code: '+91', short: 'in' },
    { name: 'Indonésie', code: '+62', short: 'id' },
    { name: 'Iran', code: '+98', short: 'ir' },
    { name: 'Irak', code: '+964', short: 'iq' },
    { name: 'Irlande', code: '+353', short: 'ie' },
    { name: 'Israël', code: '+972', short: 'il' },
    { name: 'Italie', code: '+39', short: 'it' },
    { name: 'Jamaïque', code: '+1876', short: 'jm' },
    { name: 'Japon', code: '+81', short: 'jp' },
    { name: 'Jordanie', code: '+962', short: 'jo' },
    { name: 'Kazakhstan', code: '+7', short: 'kz' },
    { name: 'Kenya', code: '+254', short: 'ke' },
    { name: 'Kiribati', code: '+686', short: 'ki' },
    { name: 'Corée du Sud', code: '+82', short: 'kr' },
    { name: 'Koweït', code: '+965', short: 'kw' },
    { name: 'Kirghizistan', code: '+996', short: 'kg' },
    { name: 'Laos', code: '+856', short: 'la' },
    { name: 'Lettonie', code: '+371', short: 'lv' },
    { name: 'Liban', code: '+961', short: 'lb' },
    { name: 'Lesotho', code: '+266', short: 'ls' },
    { name: 'Liberia', code: '+231', short: 'lr' },
    { name: 'Libye', code: '+218', short: 'ly' },
    { name: 'Liechtenstein', code: '+423', short: 'li' },
    { name: 'Lituanie', code: '+370', short: 'lt' },
    { name: 'Luxembourg', code: '+352', short: 'lu' },
    { name: 'Madagascar', code: '+261', short: 'mg' },
    { name: 'Malawi', code: '+265', short: 'mw' },
    { name: 'Malaisie', code: '+60', short: 'my' },
    { name: 'Maldives', code: '+960', short: 'mv' },
    { name: 'Mali', code: '+223', short: 'ml' },
    { name: 'Malte', code: '+356', short: 'mt' },
    { name: 'Îles Marshall', code: '+692', short: 'mh' },
    { name: 'Mauritanie', code: '+222', short: 'mr' },
    { name: 'Maurice', code: '+230', short: 'mu' },
    { name: 'Mexique', code: '+52', short: 'mx' },
    { name: 'Micronésie', code: '+691', short: 'fm' },
    { name: 'Moldavie', code: '+373', short: 'md' },
    { name: 'Monaco', code: '+377', short: 'mc' },
    { name: 'Mongolie', code: '+976', short: 'mn' },
    { name: 'Monténégro', code: '+382', short: 'me' },
    { name: 'Maroc', code: '+212', short: 'ma' },
    { name: 'Mozambique', code: '+258', short: 'mz' },
    { name: 'Myanmar', code: '+95', short: 'mm' },
    { name: 'Namibie', code: '+264', short: 'na' },
    { name: 'Nauru', code: '+674', short: 'nr' },
    { name: 'Népal', code: '+977', short: 'np' },
    { name: 'Pays-Bas', code: '+31', short: 'nl' },
    { name: 'Nouvelle-Zélande', code: '+64', short: 'nz' },
    { name: 'Nicaragua', code: '+505', short: 'ni' },
    { name: 'Niger', code: '+227', short: 'ne' },
    { name: 'Nigeria', code: '+234', short: 'ng' },
    { name: 'Norvège', code: '+47', short: 'no' },
    { name: 'Oman', code: '+968', short: 'om' },
    { name: 'Pakistan', code: '+92', short: 'pk' },
    { name: 'Palaos', code: '+680', short: 'pw' },
    { name: 'Palestine', code: '+970', short: 'ps' },
    { name: 'Panama', code: '+507', short: 'pa' },
    { name: 'Papouasie-Nouvelle-Guinée', code: '+675', short: 'pg' },
    { name: 'Paraguay', code: '+595', short: 'py' },
    { name: 'Pérou', code: '+51', short: 'pe' },
    { name: 'Philippines', code: '+63', short: 'ph' },
    { name: 'Pologne', code: '+48', short: 'pl' },
    { name: 'Portugal', code: '+351', short: 'pt' },
    { name: 'Qatar', code: '+974', short: 'qa' },
    { name: 'Roumanie', code: '+40', short: 'ro' },
    { name: 'Russie', code: '+7', short: 'ru' },
    { name: 'Rwanda', code: '+250', short: 'rw' },
    { name: 'Saint-Kitts-et-Nevis', code: '+1869', short: 'kn' },
    { name: 'Sainte-Lucie', code: '+1758', short: 'lc' },
    { name: 'Saint-Vincent-et-les-Grenadines', code: '+1784', short: 'vc' },
    { name: 'Samoa', code: '+685', short: 'ws' },
    { name: 'Saint-Marin', code: '+378', short: 'sm' },
    { name: 'Sao Tomé-et-Principe', code: '+239', short: 'st' },
    { name: 'Arabie saoudite', code: '+966', short: 'sa' },
    { name: 'Sénégal', code: '+221', short: 'sn' },
    { name: 'Serbie', code: '+381', short: 'rs' },
    { name: 'Seychelles', code: '+248', short: 'sc' },
    { name: 'Sierra Leone', code: '+232', short: 'sl' },
    { name: 'Singapour', code: '+65', short: 'sg' },
    { name: 'Slovaquie', code: '+421', short: 'sk' },
    { name: 'Slovénie', code: '+386', short: 'si' },
    { name: 'Îles Salomon', code: '+677', short: 'sb' },
    { name: 'Somalie', code: '+252', short: 'so' },
    { name: 'Afrique du Sud', code: '+27', short: 'za' },
    { name: 'Soudan du Sud', code: '+211', short: 'ss' },
    { name: 'Espagne', code: '+34', short: 'es' },
    { name: 'Sri Lanka', code: '+94', short: 'lk' },
    { name: 'Soudan', code: '+249', short: 'sd' },
    { name: 'Suriname', code: '+597', short: 'sr' },
    { name: 'Suède', code: '+46', short: 'se' },
    { name: 'Suisse', code: '+41', short: 'ch' },
    { name: 'Syrie', code: '+963', short: 'sy' },
    { name: 'Tadjikistan', code: '+992', short: 'tj' },
    { name: 'Tanzanie', code: '+255', short: 'tz' },
    { name: 'Thaïlande', code: '+66', short: 'th' }
    
  ];
  selectedCountry = this.allCountries[0];

  fournisseurData: any = {
    firstname: '',
    lastname: '',
    email: '',
    tel: '',
    adresse: '',
    is_active: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fournisseurService: FournisseurService 
  ) {}

  ngOnInit() {
    this.fournisseurId = this.route.snapshot.paramMap.get('id');
    this.fetchFournisseur();
  }

  get filteredCountries() {
    return this.allCountries.filter(c => 
      c.name.toLowerCase().includes(this.searchText.toLowerCase()) || 
      c.code.includes(this.searchText)
    );
  }

  selectCountry(c: any) {
    this.selectedCountry = c;
    this.showModal = false;
    this.searchText = '';
  }

  fetchFournisseur() {
    this.fournisseurService.getFournisseur(this.fournisseurId).subscribe({
      next: (data) => {
        this.fournisseurData = data;
        const country = this.allCountries.find(c => data.tel.startsWith(c.code));
        if (country) {
          this.selectedCountry = country;
          this.fournisseurData.tel = data.tel.replace(country.code, '').trim();
        }
      },
      error: (err) => console.error('Erreur loading fournisseur', err)
    });
  }

  onUpdate() {
    this.loading = true;
    const telFinal = this.selectedCountry.code + ' ' + this.fournisseurData.tel;

    const updatePayload: any = {
      firstname: this.fournisseurData.firstname,
      lastname: this.fournisseurData.lastname,
      email: this.fournisseurData.email,
      adresse: this.fournisseurData.adresse,
      tel: telFinal,
      is_active: this.fournisseurData.is_active
    };

    // الـ Logic متاع الـ Status اللي حكينا عليه
    if (this.fournisseurData.is_active === true) {
      updatePayload.status = 'ACTIF';
      updatePayload.deleted_at = null;
    } else {
      updatePayload.status = 'BLOQUE';
    }

    this.fournisseurService.updateFournisseur(this.fournisseurId, updatePayload).subscribe({
      next: (response) => {
        this.loading = false;
        Swal.fire({ 
          icon: 'success', 
          title: 'Mise à jour réussie', 
          text: `Le fournisseur est désormais ${updatePayload.status}`,
          timer: 2000, 
          showConfirmButton: false 
        });
        this.router.navigate(['/admin/fournisseurs']); // التوجيه لقائمة المزودين
      },
      error: (err) => {
        this.loading = false;
        console.error('Update failed', err);
        Swal.fire('Erreur', 'Vérifiez les données saisies', 'error');
      }
    });
  }
}