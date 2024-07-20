import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../../shared/services/modal.service';
import { UserManagementService } from './user-management.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
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

  searchedAppArtists: any[] = this.approvedArtists;
  searchedRegcustomers: any[] = this.registeredCustomers;
  searchedDelAccounts: any[] = this.deletedAccounts;
  searchedBanAccounts: any[] =  this.bannedAccounts;

  socialLinks: any[] = [];
  rank:number = 0;

  currentPage = 0;
  searchKeyword = '';
  allDataLoaded: boolean = false;

  constructor(
    public modalService: ModalService,
    private userManagementService: UserManagementService
  ) {}

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
      this.searchedAppArtists = this.approvedArtists;
      this.searchedRegcustomers = this.registeredCustomers;
      this.searchedDelAccounts = this.deletedAccounts;
      this.searchedBanAccounts = this.bannedAccounts;
    });
  }

  deleteUser(userId: string): void {
    this.userManagementService.deleteAccount(userId).subscribe((response) => {
      console.log('Artist account deleted successfully:', response);
      this.fetchUserData();
    });
  }

  removeBan(userId: string): void {
    this.userManagementService.removeBan(userId).subscribe((response) => {
      console.log('Ban removed successfully:', response);
      this.fetchUserData();
    });
  }

  openBanModal(user: any): void {
    this.selectedUser = { ...user };
    this.modalService.open('modal-banUser');
  }

  banUser(banUserForm: any) {
    if (banUserForm.valid) {
      const banDetails = {
        banStartDate: this.selectedUser.banStartDate,
        banEndDate: this.selectedUser.banEndDate,
        banReason: this.selectedUser.banReason,
      };
      console.log('Ban details:', banDetails);

      this.userManagementService
        .banAccount(this.selectedUser.user_id, banDetails)
        .subscribe(
          () => {
            console.log('User banned successfully');
            this.modalService.close('modal-banUser');
            this.fetchUserData();
          },
          (error) => {
            console.error('Error banning user:', error);
          }
        );
    }
  }

  openUserDetailsModal(userId:string, role:string): void {
    console.log('id',userId,role)
    this.userManagementService.getUserDetails(userId, role).subscribe(
      (response: any) => {
        console.log('response',response);
        this.selectedUser = response.userDetails[0];
        console.log('selected',this.selectedUser);
        if(role === 'artist'){
          this.socialLinks = response.socialAccounts[0];
          this.rank = response.rank.featured;
        }
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
    this.modalService.open('modal-userDetails');
  }

  searchApprovedArtists(): void {
      
  }

  searchRegisteredCustomers(searchTerm: string): void {
    searchTerm = searchTerm.toLowerCase().trim();
    if (searchTerm === '') {
      this.searchedRegcustomers = this.registeredCustomers;
    } else {
      this.searchedRegcustomers = this.registeredCustomers.filter(
        customer =>
          customer.fName.toLowerCase().includes(searchTerm)
          || customer.LName.toLowerCase().includes(searchTerm)
          || customer.location.toLowerCase().includes(searchTerm)
      );
    }
  }

  searchDeletedAccounts(searchTerm: string): void {
    searchTerm = searchTerm.toLowerCase().trim();
    if (searchTerm === '') {
      this.searchedDelAccounts = this.deletedAccounts;
    } else {
      this.searchedDelAccounts = this.deletedAccounts.filter(
        account =>
          account.fName.toLowerCase().includes(searchTerm)
          || account.LName.toLowerCase().includes(searchTerm)
          || account.location.toLowerCase().includes(searchTerm)
      );
    }
  }

  searchBannedAccounts(searchTerm: string): void {
    searchTerm = searchTerm.toLowerCase().trim();
    if (searchTerm === '') {
      this.searchedBanAccounts = this.bannedAccounts;
    } else {
      this.searchedBanAccounts = this.bannedAccounts.filter(
        account =>
          account.fName.toLowerCase().includes(searchTerm)
          || account.LName.toLowerCase().includes(searchTerm)
          || account.location.toLowerCase().includes(searchTerm)
      );
    }
  }


  updateFeaturedStatus(user_id:string){
    console.log('User ID:', user_id,'rank',this.rank);

    if(this.rank === 0){
      this.userManagementService.rankArtist(user_id).subscribe(
        (response) => {
          console.log('Artist ranked successfully:', response);
        },
        (error) => {
          console.error('Error ranking artist:', error);
        }
      );
      this.rank = 1;
    } else {
      this.userManagementService.unrankArtist(user_id).subscribe(
        (response) => {
          console.log('Artist unranked successfully:', response);
        },
        (error) => {
          console.error('Error unranking artist:', error);
        }
      );
      this.rank = 0;
    }
  }
}
