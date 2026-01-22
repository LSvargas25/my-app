

import { Component, AfterViewInit, OnDestroy, Renderer2, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expande-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expande-modal.html',
  styleUrls: ['./expande-modal.scss']
})

export class ExpandeModal implements AfterViewInit, OnDestroy {
  @ViewChild('modalRoot', { static: true }) modalRoot!: ElementRef<HTMLElement>;
  @Output() closed = new EventEmitter<void>();
  private originalBodyOverflow = '';
  private originalHtmlOverflow = '';
  private originalBodyPaddingRight = '';
  private scrollBarWidth = 0;
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Lock background scroll and add backdrop class (like pokedex)
    const body = document.body;
    const html = document.documentElement;
    this.originalBodyOverflow = body.style.overflow;
    this.originalHtmlOverflow = html.style.overflow;
    this.originalBodyPaddingRight = body.style.paddingRight;
    this.scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    this.renderer.setStyle(body, 'overflow', 'hidden');
    this.renderer.setStyle(html, 'overflow', 'hidden');
    if (this.scrollBarWidth > 0) {
      this.renderer.setStyle(body, 'paddingRight', `${this.scrollBarWidth}px`);
    }
    // Always scroll modal to top on open
    if (this.modalRoot) {
      this.modalRoot.nativeElement.scrollTop = 0;
    }
  }

  ngOnDestroy() {
    // Restore scroll and remove backdrop class (like pokedex)
    const body = document.body;
    const html = document.documentElement;
    this.renderer.setStyle(body, 'overflow', this.originalBodyOverflow || '');
    this.renderer.setStyle(html, 'overflow', this.originalHtmlOverflow || '');
    this.renderer.setStyle(body, 'paddingRight', this.originalBodyPaddingRight || '');
  }

  onBackdropClick(event: MouseEvent) {
    // Close if click is outside modal
    const modal = this.modalRoot?.nativeElement;
    if (!modal) return;
    if (!modal.contains(event.target as Node)) {
      this.closed.emit();
    }
  }
}
