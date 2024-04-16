import { Component, OnInit } from '@angular/core';
import { ArtistRequestsService } from './artist-requests.service';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-artist-requests',
  templateUrl: './artist-requests.component.html',
  styleUrls: ['./artist-requests.component.css']
})
export class ArtistRequestsComponent implements OnInit {
  pendingRequests: number = 0;
  rejectedRequests: number = 0;
  approvedArtists: number = 0;
  requestedArtists: any[] = [];
  rejectedArtists: any[] = [];
  
  selectedArtist: any ={};

  constructor(private artistRequestsService: ArtistRequestsService, public modalService: ModalService) {}

  ngOnInit(): void {
    this.fetchArtistData();
  }

  fetchArtistData(): void {
    this.artistRequestsService.getAllArtistData().subscribe((data: any) => {

      this.pendingRequests = data.totalPendingRequests;
      this.rejectedRequests = data.totalRejectedArtists;
      this.approvedArtists = data.totalApprovedArtists;
      this.requestedArtists = data.requestedArtists;
      this.rejectedArtists = data.rejectedArtists;

    });
  }

  approveArtist(userId: string): void {
    console.log('USer Id:', userId);
    this.artistRequestsService.approveArtist(userId).subscribe(response => {
      console.log('Artist approved successfully:', response);
      // Refresh artist data after approval
      this.fetchArtistData();
    });
  }

  

  rejectArtist(userId: string): void {
    console.log(userId);
    this.artistRequestsService.rejectArtist(userId).subscribe(() => {
      this.requestedArtists = this.requestedArtists.filter(artist => artist.user_Id !== userId);
      console.log('Artist rejected successfully:');
      // Refresh artist data after rejection
      this.fetchArtistData();
    });
  }
  
  deleteArtist(userId: string): void {
    this.artistRequestsService.deleteArtist(userId).subscribe(response => {
      console.log('Artist account deleted successfully:', response);
      // Refresh artist data after deletion
      this.fetchArtistData();
    });
  }

  openUserDetailsModal(artist: any): void {
    this.selectedArtist = artist;
    console.log('Selected Artist:', this.selectedArtist);
    this.modalService.open('modal-userDetails');
  }

  isCollapsed: boolean = true;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  openDeleteConfirm(artist: any){
    this.selectedArtist = {...artist};
    this.modalService.open('modal-deleteConfirm');
  }

}
