import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../components/notification/notification.component';
import { SupportTicket } from '../../shared/models/support-ticket.model';

@Component({
  selector: 'app-help',
  imports: [
    CommonModule,
    FormsModule,
    NotificationComponent
  ],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {
  @ViewChild('supportForm') supportForm!: NgForm | undefined;
  message: string = '';
  showNotification: boolean = false;
  ticket: SupportTicket = new SupportTicket();

  constructor() { }

  onSubmitSupport() {
    this.showNotification = false;
    this.message = 'Informações enviadas, aguarde o nosso contato!';
    this.showNotification = true;
  }
}
