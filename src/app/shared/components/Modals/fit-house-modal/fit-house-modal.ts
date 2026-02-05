

import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
  Renderer2,
  Output,
  EventEmitter
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-fit-house-modal',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './fit-house-modal.html',
  styleUrls: ['./fit-house-modal.scss'],
})
export class FitHouseModal implements AfterViewInit, OnDestroy {
  @Output() closed = new EventEmitter<void>();
  @ViewChild('modalRoot', { static: true })
  modalRoot!: ElementRef<HTMLElement>;

  private isBrowser: boolean;
  private observer?: IntersectionObserver;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    // SSR-safe: Only run IntersectionObserver in browser
    if (!this.isBrowser) return;
    if (this.modalRoot?.nativeElement) {
      this.modalRoot.nativeElement.scrollTop = 0;
    }
    // Optionally, add more animation triggers here if needed
  }

  ngOnDestroy() {
    if (this.isBrowser && this.observer) {
      this.observer.disconnect();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    const modal = this.modalRoot?.nativeElement;
    if (!modal) return;
    // Si el click es fuera del modal, cerrar
    if (!modal.contains(event.target as Node)) {
      this.closed.emit();
    }
  }

  onCloseClick(event: MouseEvent): void {
    event.stopPropagation();
    this.closed.emit();
  }
}
