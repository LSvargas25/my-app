import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-base-project-modal',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './base-project-modal.component.html',
  styleUrls: ['./base-project-modal.component.scss']
})
export class BaseProjectModalComponent {
  @Input() isOpen = false;
  readonly closeButtonTopClass = input('top-16 right-80');

  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }

  stop(event: MouseEvent) {
    event.stopPropagation();
  }
}
