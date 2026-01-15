import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-pokedex-modal',
  imports: [],
  templateUrl: './pokedex-modal.html',
  styleUrl: './pokedex-modal.scss',
})
export class PokedexModal implements AfterViewInit {
  @ViewChild('modalRoot', { static: true }) modalRoot!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    // Query elements in the order specified
    const root = this.modalRoot?.nativeElement || document.querySelector('[app-pokedex-modal], .pokedex-modal, .modal-root') || document.body;
    // Fallback to document if ViewChild fails
    const selectors = [
      'h4', // Header title
      'section', // Hero image section
      'h1', // Hero title
      'p', // Hero description
      'span.pokedex-badge', // Pokédex badge (add class in HTML if needed)
      '.tech-stack-card', // Technology stack cards
      '.architecture-card', // Architecture cards
      '.source-code-btn' // Source code buttons
    ];

    // Flatten all elements in order
    let elements: HTMLElement[] = [];
    selectors.forEach(sel => {
      const found = root.querySelectorAll(sel);
      elements = elements.concat(Array.from(found) as HTMLElement[]);
    });

    // Set initial state
    elements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = this.getInitialTransform(i);
    });

    // Animate in with stagger
    this.animateIn(elements, {
      duration: 500,
      delayStep: 120,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
  }

  animateIn(elements: HTMLElement[], options: { duration: number; delayStep: number; easing: string }) {
    elements.forEach((el, i) => {
      const delay = i * options.delayStep;
      const isHero = el.tagName === 'SECTION' || el.tagName === 'H1';
      const keyframes = [
        {
          opacity: 0,
          transform: isHero
            ? 'translateY(30px) scale(0.96)'
            : 'translateY(20px)'
        },
        {
          opacity: 1,
          transform: 'translateY(0) scale(1)'
        }
      ];
      el.animate(keyframes, {
        duration: options.duration,
        delay,
        easing: options.easing,
        fill: 'forwards'
      });
    });
  }

  getInitialTransform(index: number): string {
    // Hero image/hero title scale, others just translateY
    if (index === 1 || index === 2) {
      return 'translateY(30px) scale(0.96)';
    }
    return 'translateY(20px)';
  }
}
