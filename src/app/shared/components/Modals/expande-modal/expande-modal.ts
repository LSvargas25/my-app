import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-expande-modal',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './expande-modal.html',
  styleUrls: ['./expande-modal.scss'],
})
export class ExpandeModal implements AfterViewInit {
  @ViewChild('modalRoot', { static: true })
  modalRoot!: ElementRef<HTMLElement>;

  @Output() closed = new EventEmitter<void>();

  ngAfterViewInit(): void {
    // Asegura que el modal siempre abre arriba
    if (this.modalRoot?.nativeElement) {
      this.modalRoot.nativeElement.scrollTop = 0;
    }
  }

  onBackdropClick(event: MouseEvent): void {
    const modal = this.modalRoot?.nativeElement;
    if (!modal) return;

    if (!modal.contains(event.target as Node)) {
      this.closed.emit();
    }
  }
}
