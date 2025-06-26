import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupportTicket } from '../../shared/models/support-ticket.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-help',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {
  @ViewChild('supportForm') supportForm!: NgForm | undefined;
  message: string = '';
  ticket: SupportTicket = new SupportTicket();

  constructor() { }

  onSubmitSupport() {
    this.message = 'Informações enviadas, aguarde o nosso contato!';
    Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: this.message,
      confirmButtonText: 'OK'
    });
  }
}
