import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit {

  message: string = '';
  isSuccess: boolean | undefined;
  errorMessage: string = '';

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.message$.subscribe((data: any) => {
      console.log('message component, ', data)
      this.message = data.message;
      this.isSuccess = data.isSuccess;
      this.errorMessage = data.errorMessage || '';

      setTimeout(() => {
        this.message = '';
        const messageElement = document.querySelector('.message-overlay');
        if (messageElement) {
          messageElement.remove();
        }
      }, 4000);
    });
  }


}
