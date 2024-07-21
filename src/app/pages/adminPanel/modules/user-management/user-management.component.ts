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
  allDataLoaded: boolean = false;

  uniqueCountries: string[] = [];
  currentSearchTerm: string = '';
  customersearchTerm:string = '';
  currentDeletedAccountSearchTerm: string = '';
  currentBannedAccountSearchTerm: string = '';

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
      console.log('approvedArtists',this.approvedArtists);
      this.searchedRegcustomers = this.registeredCustomers;
      this.searchedDelAccounts = this.deletedAccounts;
      this.searchedBanAccounts = this.bannedAccounts;
      this.uniqueCountries = [...new Set(this.approvedArtists.map(artist => artist.location))];
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

  searchRegisteredCustomers(searchTerm: string): void {
    this.customersearchTerm = searchTerm.toLowerCase().trim(); 
    if (this.customersearchTerm === '') {
      this.searchedRegcustomers = this.registeredCustomers;
    } else {
      this.searchedRegcustomers = this.registeredCustomers.filter(
        customer =>
          customer.fName.toLowerCase().includes(this.customersearchTerm)
          || customer.LName.toLowerCase().includes(this.customersearchTerm)
          || customer.username.toLowerCase().includes(this.customersearchTerm)
          || customer.location.toLowerCase().includes(this.customersearchTerm)
      );
    }
  }
  
  sortCustomers(event: Event): void {
    const sortBy = (event.target as HTMLSelectElement).value
    if (sortBy === 'name') {
      this.searchedRegcustomers = this.searchedRegcustomers.sort((a, b) => a.fName.localeCompare(b.fName));
    } else if (sortBy === 'newest') {
      this.searchedRegcustomers = this.searchedRegcustomers.sort((a, b) => new Date(b.registered_at).getTime() - new Date(a.registered_at).getTime());
    } else if (sortBy === 'oldest') {
      this.searchedRegcustomers = this.searchedRegcustomers.sort((a, b) => new Date(a.registered_at).getTime() - new Date(b.registered_at).getTime());
    }
  }

  filterCustomersByCountry(event: Event): void {
    const country = (event.target as HTMLSelectElement).value;
    if (country === '') {
      this.searchedRegcustomers = this.registeredCustomers.filter(customer =>
        customer.fName.toLowerCase().includes(this.customersearchTerm)
        || customer.LName.toLowerCase().includes(this.customersearchTerm)
        || customer.username.toLowerCase().includes(this.customersearchTerm)
        || customer.location.toLowerCase().includes(this.customersearchTerm)
      );
    } else {
      this.searchedRegcustomers = this.registeredCustomers.filter(customer =>
        (customer.fName.toLowerCase().includes(this.customersearchTerm)
        || customer.LName.toLowerCase().includes(this.customersearchTerm)
        || customer.username.toLowerCase().includes(this.customersearchTerm)
        || customer.location.toLowerCase().includes(this.customersearchTerm)) && customer.location === country
      );
    }
  }

  searchDeletedAccounts(searchTerm: string): void {
    this.currentDeletedAccountSearchTerm = searchTerm.toLowerCase().trim(); 
    if (this.currentDeletedAccountSearchTerm === '') {
      this.searchedDelAccounts = this.deletedAccounts;
    } else {
      this.searchedDelAccounts = this.deletedAccounts.filter(
        account =>
          account.fName.toLowerCase().includes(this.currentDeletedAccountSearchTerm)
          || account.LName.toLowerCase().includes(this.currentDeletedAccountSearchTerm)
          || account.username.toLowerCase().includes(this.currentDeletedAccountSearchTerm)
          || account.location.toLowerCase().includes(this.currentDeletedAccountSearchTerm)
      );
    }
  }

  sortDeletedAccounts(event:any): void {
    const sortBy = (event.target as HTMLSelectElement).value
    if (sortBy === 'name') {
      this.searchedDelAccounts = this.searchedDelAccounts.sort((a, b) => a.fName.localeCompare(b.fName));
    } else if (sortBy === 'newest') {
      this.searchedDelAccounts = this.searchedDelAccounts.sort((a, b) => new Date(b.registered_at).getTime() - new Date(a.registered_at).getTime());
    } else if (sortBy === 'oldest') {
      this.searchedDelAccounts = this.searchedDelAccounts.sort((a, b) => new Date(a.registered_at).getTime() - new Date(b.registered_at).getTime());
    }
  }

  filterDeletedAccountsByRole(event:any): void {
    const role = (event.target as HTMLSelectElement).value;
    if (role === '') {
      this.searchedDelAccounts = this.deletedAccounts.filter(account =>
        account.fName.toLowerCase().includes(this.currentDeletedAccountSearchTerm)
        || account.LName.toLowerCase().includes(this.currentDeletedAccountSearchTerm)
        || account.username.toLowerCase().includes(this.currentDeletedAccountSearchTerm)
        || account.location.toLowerCase().includes(this.currentDeletedAccountSearchTerm)
      );
    } else {
      this.searchedDelAccounts = this.deletedAccounts.filter(account =>
        (account.fName.toLowerCase().includes(this.currentDeletedAccountSearchTerm)
        || account.LName.toLowerCase().includes(this.currentDeletedAccountSearchTerm)
        || account.username.toLowerCase().includes(this.currentDeletedAccountSearchTerm)
        || account.location.toLowerCase().includes(this.currentDeletedAccountSearchTerm)) && account.role === role
      );
    }
  }

  searchBannedAccounts(searchTerm: string): void {
    this.currentBannedAccountSearchTerm = searchTerm.toLowerCase().trim(); // Store the search term for banned accounts
    if (this.currentBannedAccountSearchTerm === '') {
      this.searchedBanAccounts = this.bannedAccounts;
    } else {
      this.searchedBanAccounts = this.bannedAccounts.filter(
        account =>
          account.fName.toLowerCase().includes(this.currentBannedAccountSearchTerm)
          || account.LName.toLowerCase().includes(this.currentBannedAccountSearchTerm)
          || account.username.toLowerCase().includes(this.currentBannedAccountSearchTerm)
          || account.location.toLowerCase().includes(this.currentBannedAccountSearchTerm)
      );
    }
  }

  sortBannedAccounts(event:any): void {
    const sortBy = (event.target as HTMLSelectElement).value
    if (sortBy === 'name') {
      this.searchedBanAccounts = this.searchedBanAccounts.sort((a, b) => a.fName.localeCompare(b.fName));
    } else if (sortBy === 'newest') {
      this.searchedBanAccounts = this.searchedBanAccounts.sort((a, b) => new Date(b.registered_at).getTime() - new Date(a.registered_at).getTime());
    } else if (sortBy === 'oldest') {
      this.searchedBanAccounts = this.searchedBanAccounts.sort((a, b) => new Date(a.registered_at).getTime() - new Date(b.registered_at).getTime());
    }
  }

  filterBannedAccountsByRole(event:any): void {
    const role = (event.target as HTMLSelectElement).value
    if (role === '') {
      this.searchedBanAccounts = this.bannedAccounts.filter(account =>
        account.fName.toLowerCase().includes(this.currentBannedAccountSearchTerm)
        || account.LName.toLowerCase().includes(this.currentBannedAccountSearchTerm)
        || account.username.toLowerCase().includes(this.currentBannedAccountSearchTerm)
        || account.location.toLowerCase().includes(this.currentBannedAccountSearchTerm)
      );
    } else {
      this.searchedBanAccounts = this.bannedAccounts.filter(account =>
        (account.fName.toLowerCase().includes(this.currentBannedAccountSearchTerm)
        || account.LName.toLowerCase().includes(this.currentBannedAccountSearchTerm)
        || account.username.toLowerCase().includes(this.currentBannedAccountSearchTerm)
        || account.location.toLowerCase().includes(this.currentBannedAccountSearchTerm)) && account.role === role
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

  filterArtistsByFeature(event: Event): void {
    const filter = (event.target as HTMLSelectElement).value;
    if (filter === '') {
      this.searchedAppArtists = this.approvedArtists.filter(artist =>
        artist.fName.toLowerCase().includes(this.currentSearchTerm)
        || artist.LName.toLowerCase().includes(this.currentSearchTerm)
        || artist.username.toLowerCase().includes(this.currentSearchTerm)
        || artist.location.toLowerCase().includes(this.currentSearchTerm)
      );
    } else if (filter === 'featured') {
      this.searchedAppArtists = this.approvedArtists.filter(artist =>
        (artist.fName.toLowerCase().includes(this.currentSearchTerm)
        || artist.LName.toLowerCase().includes(this.currentSearchTerm)
        || artist.username.toLowerCase().includes(this.currentSearchTerm)
        || artist.location.toLowerCase().includes(this.currentSearchTerm)) && artist.featured === 1
      );
    } else {
      this.searchedAppArtists = this.approvedArtists.filter(artist =>
        (artist.fName.toLowerCase().includes(this.currentSearchTerm)
        || artist.LName.toLowerCase().includes(this.currentSearchTerm)
        || artist.username.toLowerCase().includes(this.currentSearchTerm)
        || artist.location.toLowerCase().includes(this.currentSearchTerm)) && artist.featured === 0
      );
    }
  }
  
  sortArtists(event: Event): void {
    const sortBy = (event.target as HTMLSelectElement).value;
    if (sortBy === 'name') {
      this.searchedAppArtists = this.searchedAppArtists.sort((a, b) => a.fName.localeCompare(b.fName));
    } else if (sortBy === 'newest') {
      this.searchedAppArtists = this.searchedAppArtists.sort((a, b) => new Date(b.registered_at).getTime() - new Date(a.registered_at).getTime());
    } else if (sortBy === 'oldest') {
      this.searchedAppArtists = this.searchedAppArtists.sort((a, b) => new Date(a.registered_at).getTime() - new Date(b.registered_at).getTime());
    }
  }
  
  filterArtistsByCountry(event: Event): void {
    const country = (event.target as HTMLSelectElement).value;
    if (country === '') {
      this.searchedAppArtists = this.approvedArtists.filter(artist =>
        artist.fName.toLowerCase().includes(this.currentSearchTerm)
        || artist.LName.toLowerCase().includes(this.currentSearchTerm)
        || artist.username.toLowerCase().includes(this.currentSearchTerm)
        || artist.location.toLowerCase().includes(this.currentSearchTerm)
      );
    } else {
      this.searchedAppArtists = this.approvedArtists.filter(artist =>
        (artist.fName.toLowerCase().includes(this.currentSearchTerm)
        || artist.LName.toLowerCase().includes(this.currentSearchTerm)
        || artist.username.toLowerCase().includes(this.currentSearchTerm)
        || artist.location.toLowerCase().includes(this.currentSearchTerm)) && artist.location === country
      );
    }
  }
  
  searchApprovedArtists(searchTerm: string): void {
    this.currentSearchTerm = searchTerm.toLowerCase().trim();
    if (this.currentSearchTerm === '') {
      this.searchedAppArtists = this.approvedArtists;
    } else {
      this.searchedAppArtists = this.approvedArtists.filter(
        artist =>
          artist.fName.toLowerCase().includes(this.currentSearchTerm)
          || artist.LName.toLowerCase().includes(this.currentSearchTerm)
          || artist.username.toLowerCase().includes(this.currentSearchTerm)
          || artist.location.toLowerCase().includes(this.currentSearchTerm)
      );
    }
  }
}
