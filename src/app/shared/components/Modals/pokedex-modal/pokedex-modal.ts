/* ======================================================
   Decorative Pokémon Sprite System
====================================================== */

type PokemonSpriteConfig = {
  images: Array<{ src: string; alt: string }>;
  minSize: number;
  maxSize: number;
  minOpacity: number;
  maxOpacity: number;
  density: number;
  zIndex?: number;
  safePadding?: number;
};

interface SpawnedPokemonSprite {
  el: HTMLImageElement;
  phase: number;
  baseX: number;
  baseY: number;
  driftX: number;
  driftY: number;
  rot: number;
  size: number;
  opacity: number;
  curDx: number;
  curDy: number;
}

/* ===== Internal State ===== */
let spriteLoopId: number | null = null;
let spriteCleanupFn: (() => void) | null = null;

/* ======================================================
   Sprite Spawner
====================================================== */
export function spawnDecorativePokemonSprites(
  config: PokemonSpriteConfig
): () => void {

  if (spriteCleanupFn) spriteCleanupFn();

  const outer = document.querySelector('.pokedex-modal-outer') as HTMLElement | null;
  const modal = document.querySelector('.pokedex-modal-inner') as HTMLElement | null;
  if (!outer || !modal) return () => {};

  const outerRect = outer.getBoundingClientRect();
  const modalRect = modal.getBoundingClientRect();
  const safePadding = config.safePadding ?? 32;

  const sprites: SpawnedPokemonSprite[] = [];
  const placedRects: { x: number; y: number; size: number }[] = [];

  const rand = (min: number, max: number) => min + Math.random() * (max - min);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const pickZone = (): 'top' | 'bottom' | 'left' | 'right' => {
    const zones: Array<'top' | 'bottom' | 'left' | 'right'> = [
      'top', 'bottom', 'left', 'right', 'right'
    ];
    return zones[Math.floor(Math.random() * zones.length)];
  };

  const overlapsModal = (x: number, y: number, size: number) =>
    x + size > modalRect.left + safePadding &&
    x < modalRect.right - safePadding &&
    y + size > modalRect.top + safePadding &&
    y < modalRect.bottom - safePadding;

  /* ===================== Placement ===================== */
  const spriteData = [];

  for (let i = 0; i < config.density; i++) {
    let placed = false;
    let tries = 0;
    let x = 0, y = 0, size = 0;

    const zone = pickZone();
    const img = config.images[Math.floor(Math.random() * config.images.length)];
    const opacity = rand(config.minOpacity, config.maxOpacity);

    while (!placed && tries < 40) {
      size = rand(config.minSize, config.maxSize);
      const margin = safePadding + size / 2;

      if (zone === 'top') {
        x = rand(outerRect.left + margin, outerRect.right - size - margin);
        y = rand(outerRect.top + margin, modalRect.top - size - margin);
      } else if (zone === 'bottom') {
        x = rand(outerRect.left + margin, outerRect.right - size - margin);
        y = rand(modalRect.bottom + margin, outerRect.bottom - size - margin);
      } else if (zone === 'left') {
        x = rand(outerRect.left + margin, modalRect.left - size - margin);
        y = rand(outerRect.top + margin, outerRect.bottom - size - margin);
      } else {
        x = rand(modalRect.right + margin, outerRect.right - size - margin);
        y = rand(outerRect.top + margin, outerRect.bottom - size - margin);
      }

      const overlap = placedRects.some(r =>
        !(x + size < r.x - 8 ||
          x > r.x + r.size + 8 ||
          y + size < r.y - 8 ||
          y > r.y + r.size + 8)
      );

      if (!overlap && !overlapsModal(x, y, size)) {
        placedRects.push({ x, y, size });
        placed = true;
      }

      tries++;
    }

    if (!placed) continue;

    spriteData.push({
      img,
      x,
      y,
      size,
      opacity,
      phase: rand(0, Math.PI * 2),
      driftX: rand(6, 18),
      driftY: rand(6, 18),
      rot: rand(2, 4),
    });
  }

  /* ===================== Spawn ===================== */
  spriteData.forEach((d, i) => {
    setTimeout(() => {
      const el = document.createElement('img');
      el.src = d.img.src;
      el.alt = d.img.alt;
      el.className = 'pokedex-deco-sprite';
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('draggable', 'false');

      Object.assign(el.style, {
        position: 'fixed',
        left: `${d.x}px`,
        top: `${d.y}px`,
        width: `${d.size}px`,
        opacity: '0',
        pointerEvents: 'none',
        zIndex: String(config.zIndex ?? 1001),
        transition: 'opacity 0.7s',
      });

      outer.appendChild(el);
      requestAnimationFrame(() => el.style.opacity = String(d.opacity));

      sprites.push({
        el,
        phase: d.phase,
        baseX: d.x,
        baseY: d.y,
        driftX: d.driftX,
        driftY: d.driftY,
        rot: d.rot,
        size: d.size,
        opacity: d.opacity,
        curDx: 0,
        curDy: 0,
      });
    }, i * 110);
  });

  /* ===================== Animation ===================== */
  let mouseX = -1000, mouseY = -1000;
  const onMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };
  window.addEventListener('mousemove', onMouseMove);

  const animate = () => {
    const t = performance.now() / 1000;

    sprites.forEach(s => {
      let dx = Math.sin(t * 0.7 + s.phase) * s.driftX;
      let dy = Math.cos(t * 0.5 + s.phase) * s.driftY;
      const rot = Math.sin(t * 0.4 + s.phase) * s.rot;

      const rect = s.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(cx - mouseX, cy - mouseY);

      if (dist < 120) {
        const a = Math.atan2(cy - mouseY, cx - mouseX);
        const f = Math.min((120 - dist) * 1.1, 38);
        dx += Math.cos(a) * f;
        dy += Math.sin(a) * f;
      }

      s.curDx = lerp(s.curDx, dx, 0.22);
      s.curDy = lerp(s.curDy, dy, 0.22);

      s.el.style.transform =
        `translate3d(${s.curDx}px, ${s.curDy}px, 0) rotate(${rot}deg)`;
    });

    spriteLoopId = requestAnimationFrame(animate);
  };

  animate();

  /* ===================== Cleanup ===================== */
  spriteCleanupFn = () => {
    if (spriteLoopId) cancelAnimationFrame(spriteLoopId);
    sprites.forEach(s => s.el.remove());
    window.removeEventListener('mousemove', onMouseMove);
    spriteCleanupFn = null;
  };

  return spriteCleanupFn;
}

/* ======================================================
   Angular Component
====================================================== */


import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
  OnDestroy,
  Output,
  EventEmitter,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pokedex-modal',
  templateUrl: './pokedex-modal.html',
  styleUrls: ['./pokedex-modal.scss'],
})
export class PokedexModal implements AfterViewInit, OnDestroy {

  @ViewChild('modalRoot', { static: true }) modalRoot!: ElementRef<HTMLElement>;
  @ViewChild('modalOuter', { static: true }) modalOuter!: ElementRef<HTMLElement>;
  @Output() closed = new EventEmitter<void>();

  private observer: IntersectionObserver | null = null;
  private cleanupSprites: (() => void) | null = null;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const root = this.modalRoot.nativeElement;
      root.scrollTop = 0;

      const targets = Array.from(
        root.querySelectorAll('.fade-in-on-scroll')
      ) as HTMLElement[];

      // Force reveal all modal content immediately on open
      targets.forEach(el => {
        el.classList.remove('scroll-hidden');
        el.classList.add('scroll-reveal');
      });

      // Optionally, keep IntersectionObserver for scroll-based animation
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          e.target.classList.toggle('scroll-reveal', e.isIntersecting);
          e.target.classList.toggle('scroll-hidden', !e.isIntersecting);
        });
      }, { threshold: 0.18 });

        // NUEVO: Animaciones para scroll-fade-up, scroll-slide-left, scroll-scale-in
        const scrollAnimated = Array.from(
          root.querySelectorAll('.scroll-fade-up, .scroll-slide-left, .scroll-scale-in')
        ) as HTMLElement[];

        const scrollObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            } else {
              entry.target.classList.remove('visible');
            }
          });
        }, { threshold: 0.18 });

        scrollAnimated.forEach(el => scrollObserver.observe(el));
        // Guardar para limpiar en ngOnDestroy
        (this as any)._scrollObserver = scrollObserver;

      targets.forEach(el => this.observer!.observe(el));

      this.cleanupSprites = spawnDecorativePokemonSprites({
        images: [
          { src: '/assets/images/Bulbasaur.png', alt: 'Bulbasaur' },
          { src: '/assets/images/Pikachu.png', alt: 'Pikachu' },
          { src: '/assets/images/Charizard.png', alt: 'Charizard' },
          { src: '/assets/images/Nidoquen.png', alt: 'Nidoquen' },
          { src: '/assets/images/Piplup.png', alt: 'Piplup' },
          { src: '/assets/images/Squirt.png', alt: 'Squirtle' },
        ],
        minSize: 54,
        maxSize: 110,
        minOpacity: 0.22,
        maxOpacity: 0.5,
        density: 60,
        zIndex: 1001,
        safePadding: 24,
      });
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.observer?.disconnect();
      this.cleanupSprites?.();
        // Limpiar el nuevo observer de scroll
        if ((this as any)._scrollObserver) {
          (this as any)._scrollObserver.disconnect();
          (this as any)._scrollObserver = null;
        }
    }
  }

  closeModal(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('pokedex-modal-outer')) {
      this.closeModal();
    }
  }
}
