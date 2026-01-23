import { Component, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-vc-bike-service-modal',
  imports: [],
  templateUrl: './vc-bike-service-modal.html',
  styleUrl: './vc-bike-service-modal.scss',
})
export class VcBikeServiceModal implements AfterViewInit, OnDestroy {
  private originalBodyOverflow?: string;
  private originalHtmlOverflow?: string;
  private originalBodyPaddingRight?: string;
  private scrollBarWidth?: number;
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      // No bloquear el scroll del fondo
      // const body = document.body;
      // const html = document.documentElement;
      // this.originalBodyOverflow = body.style.overflow;
      // this.originalHtmlOverflow = html.style.overflow;
      // this.originalBodyPaddingRight = body.style.paddingRight;
      // this.scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      // this.renderer.setStyle(body, 'overflow', 'hidden');
      // this.renderer.setStyle(html, 'overflow', 'hidden');
      // if (this.scrollBarWidth > 0) {
      //   this.renderer.setStyle(body, 'paddingRight', `${this.scrollBarWidth}px`);
      // }
    }
  }

  ngOnDestroy() {
    // Ya no es necesario restaurar el scroll del fondo
  }
}
