import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { SideNavToggle } from '../../../shared/interfaces/SideNavToggle';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { ModalService } from '../../../shared/services/modal.service';
import { defaultLayoutService } from '../default-layout/default-layout.service'
import { ImageUploadService } from '../../../shared/services/image-upload.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css'],
  animations: [
    trigger('rotate',[
      transition(':enter', [
        animate('500ms',
        keyframes([
          style({transform: 'rotate(0deg)', offset: 0}),
          style({transform: 'rotate(1turn)', offset: 1})
        ]))
      ])
    ])
  ]
})
export class DefaultLayoutComponent implements OnInit{

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  collapsed = false;
  navData = navbarData; 
  screenWidth = 0;

  adminId:string='';
  adminDetails:any = {
    profile_photo: null,
    name: '',
    email: ''
  };

  passwordDetails:any = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  profilePictureObj: File | undefined;
  profilePictureUrl: string = '';
  uploadProgress: number | undefined;
  imageObj: File | undefined;

  @HostListener('window:resize', ['$event'])
  onResize(event: any){
    this.screenWidth = window.innerWidth;
    if(this.screenWidth < 768){
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
    } else {
      this.collapsed = true;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})

    }
  }

  constructor(
    private router: Router,
    public modalservice: ModalService,
    private layoutService: defaultLayoutService,
    private imageUploadService : ImageUploadService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.screenWidth = window.innerWidth;
    }
    this.adminId = localStorage.getItem('admin_id') || '';
    this.loadAdminDetails(this.adminId);
  }

  loadAdminDetails(adminId: string): void {
    this.layoutService.getAdminDetails(adminId).subscribe(
      (data:any) => {
        console.log('Admin details', data);
        this.adminDetails = data.admin;
        this.profilePictureUrl = data.admin.profile_photo || ''; 
        this.passwordDetails.currentPassword = data.admin.password;
      },
      error => {
        console.error('Error fetching admin details', error);
      }
    );
  }


  openEditModal():void{
    this.modalservice.open('modal-editAdminDetails');
  }

  toggleCollapse(): void{
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }

  closeSidenav(): void{
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }
  toggleSidenav(): void {
    this.collapsed = !this.collapsed;
  }

  getBodyClass(): string{
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768){
      styleClass = 'body-trimmed';
    } else if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0){
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }

  logout(): void{
    localStorage.removeItem('accessToken');
    localStorage.removeItem('admin_id');
    this.router.navigate(['/']);
  }

  updateDetails(){
    this.layoutService.updateAdminDetails(this.adminId, this.adminDetails).subscribe(
      (response:any) => {
        this.modalservice.close('modal-editAdminDetails');
        this.alertService.showMessage('Admin details updated successfully', true);
      },
      (error) => {
        this.modalservice.close('modal-editAdminDetails');
        this.alertService.showMessage('Error updating admin details', false, error.message);
      }
    );
  }

  removeExistingImage() {
    if (this.adminDetails.profile_photo) {
      const key = this.adminDetails.profile_photo.split('/').pop();
      this.imageUploadService.removeImage(key as any).subscribe(
        () => {
          this.adminDetails.profile_photo = '';
        },
        (error) => {
          this.alertService.showMessage('Error removing image', false, error.message);
        }
      );
    }
  }
  onFileSelected(event: any) {
    const FILE = (event.target as HTMLInputElement).files?.[0];
    this.imageObj = FILE;
  }
  newImageUpload(folder:string, uploadType:string) {
    const imageForm = new FormData();
    imageForm.append('image', this.imageObj as Blob);
    
    this.imageUploadService.imageUpload(imageForm, folder, uploadType).subscribe((res: any) => {
      this.adminDetails.profile_photo = res.image.location;
      this.alertService.showMessage('Image uploaded successfully', true);
    });
  }
  removeImage() {
    if (this.adminDetails.profile_photo) {
      const key = this.adminDetails.profile_photo.split('/').pop();
      this.imageUploadService.removeImage(key as any).subscribe(
        () => {
          //this.imageUrl = '';
          this.adminDetails.profile_photo='';
        },
        (error) => {
          this.alertService.showMessage('Error removing image', false, error.message);
        }
      );
    }
  }

  passwordStrength: string = '';
  passwordCriteria = {
    length: false,
    symbol: false,
    number: false,
    uppercase: false,
    lowercase: false
  };

  get isPasswordStrong(): boolean {
    return this.passwordStrength === 'Strong';
  }

  get isConfirmPasswordValid(): boolean {
    return this.passwordDetails.newPassword === this.passwordDetails.confirmNewPassword;
  }

  get isCurrentPasswordNotUsed(): boolean {
    return this.passwordDetails.newPassword !== this.passwordDetails.currentPassword;
  }

  checkPasswordStrength() {
    const password = this.passwordDetails.newPassword;
    this.passwordCriteria.length = password.length >= 8;
    this.passwordCriteria.symbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.passwordCriteria.number = /\d/.test(password);
    this.passwordCriteria.uppercase = /[A-Z]/.test(password);
    this.passwordCriteria.lowercase = /[a-z]/.test(password);

    if (this.passwordCriteria.length && this.passwordCriteria.symbol && this.passwordCriteria.number && this.passwordCriteria.uppercase && this.passwordCriteria.lowercase) {
      this.passwordStrength = 'Strong';
    } else if (this.passwordCriteria.length && (this.passwordCriteria.symbol || this.passwordCriteria.number || this.passwordCriteria.uppercase)) {
      this.passwordStrength = 'Moderate';
    } else if (this.passwordCriteria.length) {
      this.passwordStrength = 'Weak';
    } else {
      this.passwordStrength = '';
    }
  }
  validateConfirmPassword(confirmNewPwd: any) {
    if (this.passwordDetails.newPassword !== this.passwordDetails.confirmNewPassword) {
      confirmNewPwd.control.setErrors({ mismatch: true });
    } else {
      confirmNewPwd.control.setErrors(null);
    }
  }

  updatePassword() {
    if (this.passwordDetails.newPassword === this.passwordDetails.confirmNewPassword) {
      if (this.passwordDetails.newPassword !== this.passwordDetails.currentPassword) {
        console.log(this.passwordDetails);
    this.layoutService.updateAdminPassword(this.adminId, this.passwordDetails.newPassword).subscribe(
      (response:any) => {
        this.modalservice.close('modal-editAdminDetails');
        this.alertService.showMessage('Password updated successfully', true);
      },
      (error) => {
        this.modalservice.close('modal-editAdminDetails');
        this.alertService.showMessage('Error updating password', false, error.message);
      }
    );
      } else {
        alert('New password cannot be the same as the current password');
      }
    } else {
      alert('Passwords do not match');
    }
  }
}
