import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isVisible = false;
  @Input() title = '';
  @Input() closeButtonText = 'OK';
  @Output() closed = new EventEmitter<void>();

  onClose(): void {
    this.closed.emit();
  }
}