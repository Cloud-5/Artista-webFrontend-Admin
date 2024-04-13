import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../../shared/services/modal.service';
import { UserManagementService } from './user-management.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {

  totaluserRegistrations: number = 0;
  totalapprovedArtists: number = 0;
  totalregisteredCustomers: number = 0;
  totaldeletedAccounts: number = 0;
  totalbannedAccounts: number = 0;
  approvedArtists: any[] = [];
  registeredCustomers: any[] = [];
  deletedAccounts: any[] = [];
  bannedAccounts: any[] = [];


  selectedUser: any = {};

  constructor(
    public modalService: ModalService,
    private userManagementService: UserManagementService,
  ) { }

  ngOnInit() {
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.userManagementService.getAllUserData().subscribe((data: any) => {
      this.totaluserRegistrations = data.totalUserRegistrations;
      this.totalapprovedArtists = data.totalApprovedArtists;
      this.totalregisteredCustomers = data.totalRegisteredCustomers;
      this.totaldeletedAccounts = data.totalDeletedAccounts;
      this.totalbannedAccounts = data.totalBannedAccounts;
      this.approvedArtists = data.approvedArtists;
      this.registeredCustomers = data.registeredCustomers;
      this.deletedAccounts = data.deletedAccounts;
      this.bannedAccounts = data.bannedAccounts;
    })
  }

  deleteUser(userId: string): void {
    this.userManagementService.deleteAccount(userId).subscribe(response => {
      console.log('Artist account deleted successfully:', response);

      this.fetchUserData();
    });
  }

  removeBan(userId: string): void {
    this.userManagementService.removeBan(userId).subscribe(response => {
      console.log('Ban removed successfully:', response);
      this.fetchUserData();
    });
  }

  openBanModal(user: any): void {
    this.selectedUser = { ...user };
    console.log('Selected user:', user);
    this.modalService.open('modal-banUser');
  }

  banUser(banUserForm: any) {
    if (banUserForm.valid) {
      const banDetails = {
        banStartDate: this.selectedUser.banStartDate,
        banEndDate: this.selectedUser.banEndDate,
        banReason: this.selectedUser.banReason
      };
      console.log('Ban details:', banDetails);
  
      this.userManagementService.banAccount(this.selectedUser.user_id, banDetails).subscribe(
        () => {
          console.log('User banned successfully');
          
          alert('User banned successfully');
          
          this.modalService.close('modal-banUser');
          
          this.fetchUserData();
        },
        (error) => {
          console.error('Error banning user:', error);
          
          alert('Error banning user. Please try again.');
          
        }
      );
    }
  }
  openUserDetailsModal(artist: any): void {
    this.selectedUser = artist;
    console.log('Selected Artist:', this.selectedUser);
    this.modalService.open('modal-userDetails');
  }
  
}
