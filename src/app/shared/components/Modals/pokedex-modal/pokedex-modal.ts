import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pokedex-modal',
  imports: [],
  templateUrl: './pokedex-modal.html',
  styleUrls: ['./pokedex-modal.scss'],
})
export class PokedexModal implements AfterViewInit, OnDestroy {
  @ViewChild('modalRoot', { static: true }) modalRoot!: ElementRef<HTMLElement>;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('modalOuter', { static: true }) modalOuter!: ElementRef<HTMLElement>;
  private originalBodyOverflow = '';
  private originalHtmlOverflow = '';
  private originalBodyPaddingRight = '';
  private scrollBarWidth = 0;
  private observer: IntersectionObserver | null = null;
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    // 1. Scroll reveal logic (igual que antes)
    const root = this.modalRoot?.nativeElement;
    if (root) {
      const elements = Array.from(root.querySelectorAll('.fade-in-on-scroll')) as HTMLElement[];
      elements.forEach(el => {
        el.classList.add('scroll-hidden');
        el.classList.remove('scroll-reveal');
      });
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal');
            entry.target.classList.remove('scroll-hidden');
          } else {
            entry.target.classList.remove('scroll-reveal');
            entry.target.classList.add('scroll-hidden');
          }
        });
      }, {
        root: null,
        threshold: 0.18
      });
      elements.forEach(el => this.observer!.observe(el));
    }

    // Redirigir el scroll del fondo al modal central
    if (this.modalOuter && this.modalRoot) {
      const outer = this.modalOuter.nativeElement;
      const inner = this.modalRoot.nativeElement;
      outer.addEventListener('wheel', (e: WheelEvent) => {
        // Solo redirigir si el scroll no está sobre el modal central
        if (e.target === outer) {
          inner.scrollTop += e.deltaY;
          e.preventDefault();
        }
      }, { passive: false });
    }

    // 2. Lock page scroll (body/html)
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
  }

  ngOnDestroy() {
    // Restore scroll state
    const body = document.body;
    const html = document.documentElement;
    this.renderer.setStyle(body, 'overflow', this.originalBodyOverflow || '');
    this.renderer.setStyle(html, 'overflow', this.originalHtmlOverflow || '');
    this.renderer.setStyle(body, 'paddingRight', this.originalBodyPaddingRight || '');
    if (this.observer) this.observer.disconnect();
    // Limpieza del listener de scroll si es necesario (opcional)
  }

  closeModal() {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent) {
    // Only close if click is on the backdrop, not inside modal
    if (event.target && (event.target as HTMLElement).classList.contains('pokedex-modal-outer')) {
      this.closeModal();
    }
  }

  // Animación manual eliminada, todo es scroll reveal
}
