import { Component, OnInit } from '@angular/core';
import { ArtistRequestsService } from './artist-requests.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { error } from 'node:console';

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

  selectedArtist: any = {};
  socialLinks: any[] = [];

  constructor(
    private artistRequestsService: ArtistRequestsService,
    public modalService: ModalService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.fetchArtistData();
  }

  fetchArtistData(): void {
    this.artistRequestsService.getAllArtistData().subscribe(
      (data: any) => {
        this.pendingRequests = data.totalPendingRequests;
        this.rejectedRequests = data.totalRejectedArtists;
        this.approvedArtists = data.totalApprovedArtists;
        this.requestedArtists = data.requestedArtists;
        this.rejectedArtists = data.rejectedArtists;
      },
      (error) => {
        this.alertService.showMessage('Error fetching artist data', false, error.message);
      });
  }

  approveArtist(userId: string): void {
    this.artistRequestsService.approveArtist(userId).subscribe(
      (response: any) => {
        console.log('Artist approved successfully:', response);
        this.fetchArtistData();
      },
      (error) => {
        this.alertService.showMessage('Error approving artist', false, error.message);
      });
  }



  rejectArtist(userId: string): void {
    console.log(userId);
    this.artistRequestsService.rejectArtist(userId).subscribe(
      () => {
        this.requestedArtists = this.requestedArtists.filter(artist => artist.user_Id !== userId);
        this.fetchArtistData();
        this.alertService.showMessage('Artist rejected successfully', true);
      },
      (error) => {
        this.alertService.showMessage('Error rejecting artist', false, error.message);
      });
  }

  deleteArtist(userId: string): void {
    this.artistRequestsService.deleteArtist(userId).subscribe(
      () => {
        this.fetchArtistData();
        this.alertService.showMessage('Artist account deleted successfully', true);
      }, (error) => {
        this.alertService.showMessage('Error deleting artist account', false, error.message);
      
      });
  }

  openUserDetailsModal(userId: any): void {
    this.artistRequestsService.getArtistDetails(userId).subscribe(
      (response:any) => {
        console.log('response',response);
        this.selectedArtist = response.artistDetails;
        this.socialLinks = response.socialAccounts;        ;
        console.log('selected one',this.socialLinks)


      },
      (error) => {
        this.alertService.showMessage('Error fetching artist details', false, error.message);
      }
    )
    this.modalService.open('modal-userDetails');
  }


  openDeleteConfirm(artist: any) {
    this.selectedArtist = { ...artist };
    this.modalService.open('modal-deleteConfirm');
  }

}
