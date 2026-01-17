import { Component, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-expande-modal',
  imports: [],
  templateUrl: './expande-modal.html',
  styleUrl: './expande-modal.scss',
})
export class ExpandeModal implements AfterViewInit, OnDestroy {
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Lock background scroll and add backdrop class
    this.renderer.addClass(document.body, 'expande-modal-open');
    this.renderer.addClass(document.documentElement, 'expande-modal-open');
  }

  ngOnDestroy() {
    // Restore scroll and remove backdrop class
    this.renderer.removeClass(document.body, 'expande-modal-open');
    this.renderer.removeClass(document.documentElement, 'expande-modal-open');
  }
}
