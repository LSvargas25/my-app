// ===================== Decorative Pokémon Sprite System =====================
type PokemonSpriteConfig = {
  images: Array<{ src: string; alt: string; }>,
  minSize: number,
  maxSize: number,
  minOpacity: number,
  maxOpacity: number,
  density: number,
  zIndex?: number,
  safePadding?: number,
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
}

let globalPokemonSpriteLoop: number | null = null;
let globalPokemonSprites: SpawnedPokemonSprite[] = [];
let globalPokemonSpriteCleanup: (() => void) | null = null;

export function spawnDecorativePokemonSprites(config: PokemonSpriteConfig) {
    // Helper: clamp value between min and max
    function clamp(val: number, min: number, max: number) {
      return Math.max(min, Math.min(max, val));
    }
  // Clean up any previous sprites
  if (globalPokemonSpriteCleanup) globalPokemonSpriteCleanup();
  globalPokemonSprites = [];
  const outer = document.querySelector('.pokedex-modal-outer') as HTMLElement;
  const modal = document.querySelector('.pokedex-modal-inner') as HTMLElement;
  if (!outer || !modal) return;

  const outerRect = outer.getBoundingClientRect();
  const modalRect = modal.getBoundingClientRect();
  const sprites: SpawnedPokemonSprite[] = [];
  const usedZones: Array<'top'|'bottom'|'left'|'right'> = [];
  const safePadding = config.safePadding ?? 32;
  const maxTries = 40;

  // Helper: pick a random zone around the modal, bias to right
  function pickZone() {
    // Bias: right zone appears 2x as often
    const zones: Array<'top'|'bottom'|'left'|'right'> = ['top','bottom','left','right','right'];
    return zones[Math.floor(Math.random()*zones.length)];
  }

  // Helper: random between min and max
  function rand(min: number, max: number) {
    return min + Math.random() * (max - min);
  }

  // Helper: check if a rect overlaps the modal (but allow passing above and below)
  function overlapsModal(x: number, y: number, w: number, h: number) {
    // Only block if inside modal horizontally and vertically
    const insideHoriz = x + w > modalRect.left + safePadding && x < modalRect.right - safePadding;
    const insideVert = y + h > modalRect.top + safePadding && y < modalRect.bottom - safePadding;
    return insideHoriz && insideVert;
  }

  // Try to spawn N sprites, prevent overlap
  const placedRects: {x:number, y:number, size:number}[] = [];
  // Precalcular posiciones y datos de todos los sprites
  const spriteData: Array<{
    imgConf: { src: string; alt: string },
    x: number, y: number, size: number, opacity: number,
    phase: number, driftX: number, driftY: number, rot: number
  }> = [];
  for (let i = 0; i < config.density; ++i) {
    let tries = 0;
    let placed = false;
    let zone: 'top'|'bottom'|'left'|'right' = pickZone();
    let x = 0, y = 0, size = 0;
    let imgConf = config.images[Math.floor(Math.random()*config.images.length)];
    let opacity = rand(config.minOpacity, config.maxOpacity);
    while (!placed && tries < maxTries) {
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
      } else if (zone === 'right') {
        x = rand(modalRect.right + margin, outerRect.right - size - margin);
        y = rand(outerRect.top + margin, outerRect.bottom - size - margin);
      }
      let overlapsOther = false;
      for (const r of placedRects) {
        if (!(x + size < r.x - 8 || x > r.x + r.size + 8 || y + size < r.y - 8 || y > r.y + r.size + 8)) {
          overlapsOther = true;
          break;
        }
      }
      if (!overlapsModal(x, y, size, size) && !overlapsOther) {
        placed = true;
        placedRects.push({x, y, size});
      } else {
        zone = pickZone();
        tries++;
      }
    }
    if (!placed) continue;
    spriteData.push({ imgConf, x, y, size, opacity,
      phase: rand(0, Math.PI * 2), driftX: rand(6, 18), driftY: rand(6, 18), rot: rand(2, 4) });
  }

  // Animación de aparición progresiva
  let appearIndex = 0;
  function addNextSprite() {
    if (appearIndex >= spriteData.length) return;
    const d = spriteData[appearIndex];
    const el = document.createElement('img');
    el.src = d.imgConf.src;
    el.alt = d.imgConf.alt;
    el.className = 'pokedex-deco-sprite';
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('draggable', 'false');
    el.style.position = 'fixed';
    el.style.left = `${d.x}px`;
    el.style.top = `${d.y}px`;
    el.style.width = `${d.size}px`;
    el.style.height = 'auto';
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    el.style.userSelect = 'none';
    el.style.zIndex = String(config.zIndex ?? 1001);
    el.style.transition = 'opacity 0.7s';
    el.style.filter = 'drop-shadow(0 0 18px #fff8) drop-shadow(0 0 32px #00e5ff66)';
    outer.appendChild(el);
    // For animation loop
    const sprite = { el, phase: d.phase, baseX: d.x, baseY: d.y, driftX: d.driftX, driftY: d.driftY, rot: d.rot, size: d.size, opacity: d.opacity };
    (sprite as any).curDx = 0;
    (sprite as any).curDy = 0;
    sprites.push(sprite);
    setTimeout(() => { el.style.opacity = `${d.opacity}`; }, 60);
    appearIndex++;
    if (appearIndex < spriteData.length) {
      setTimeout(addNextSprite, 110); // Intervalo entre apariciones
    }
  }
  addNextSprite();

  // Animation loop and mouse repulsion
  let running = true;
  let mouseX = -1000, mouseY = -1000;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  function animateSprites() {
    if (!running) return;
    const t = performance.now() / 1000;
    for (const s of sprites) {
      // Sine-based float, drift, and rotation
      let baseDx = Math.sin(t * 0.7 + s.phase) * s.driftX;
      let baseDy = Math.cos(t * 0.5 + s.phase) * s.driftY;
      let rot = Math.sin(t * 0.4 + s.phase) * s.rot;

      // Repel from mouse if close
      const rect = s.el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(centerX - mouseX, centerY - mouseY);
      let targetDx = baseDx;
      let targetDy = baseDy;
      if (dist < 120) {
        const angle = Math.atan2(centerY - mouseY, centerX - mouseX);
        const repelStrength = Math.min((120 - dist) * 1.1, 38);
        targetDx += Math.cos(angle) * repelStrength;
        targetDy += Math.sin(angle) * repelStrength;
      }
      (s as any).curDx = lerp((s as any).curDx, targetDx, 0.22);
      (s as any).curDy = lerp((s as any).curDy, targetDy, 0.22);

      // Clamp para evitar invasión del modal
      const spriteBaseX = s.baseX;
      const spriteBaseY = s.baseY;
      const spriteSize = s.size;
      let finalX = spriteBaseX + (s as any).curDx;
      let finalY = spriteBaseY + (s as any).curDy;
      if (finalX + spriteSize > modalRect.left + safePadding && finalX < modalRect.right - safePadding &&
          finalY + spriteSize > modalRect.top + safePadding && finalY < modalRect.bottom - safePadding) {
        if (finalX < modalRect.left + safePadding) finalX = modalRect.left + safePadding - spriteSize;
        if (finalX + spriteSize > modalRect.right - safePadding) finalX = modalRect.right - safePadding;
        if (finalY < modalRect.top + safePadding) finalY = modalRect.top + safePadding - spriteSize;
        if (finalY + spriteSize > modalRect.bottom - safePadding) finalY = modalRect.bottom - safePadding;
        (s as any).curDx = finalX - spriteBaseX;
        (s as any).curDy = finalY - spriteBaseY;
      }
      s.el.style.transform = `translate3d(${(s as any).curDx}px,${(s as any).curDy}px,0) rotate(${rot}deg)`;
    }
    globalPokemonSpriteLoop = requestAnimationFrame(animateSprites);
  }
  animateSprites();

  // Cleanup function
  globalPokemonSpriteCleanup = () => {
    running = false;
    if (globalPokemonSpriteLoop) cancelAnimationFrame(globalPokemonSpriteLoop);
    for (const s of sprites) {
      if (s.el.parentNode) s.el.parentNode.removeChild(s.el);
    }
    globalPokemonSprites = [];
    globalPokemonSpriteCleanup = null;
  };
  globalPokemonSprites = sprites;
  return globalPokemonSpriteCleanup;
}
import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pokedex-modal',
  imports: [],
  templateUrl: './pokedex-modal.html',
  styleUrls: ['./pokedex-modal.scss'],
})
export class PokedexModal implements AfterViewInit, OnDestroy {
  // Decorative Pokémon sprite logic
  private pokedexDecoSprites: HTMLElement[] = [];
  private pokedexDecoObserver: IntersectionObserver | null = null;
  private pokedexDecoScrollHandler: (() => void) | null = null;
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
      // Siempre hacer scroll al principio al abrir el modal
      root.scrollTop = 0;
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
        if (e.target === outer) {
          inner.scrollTop += e.deltaY;
          e.preventDefault();
        }
      }, { passive: false });
    }


    // ===================== Decorative Pokémon Sprite System (NEW) =====================
    spawnDecorativePokemonSprites({
      images: [
        { src: '/assets/images/Bulbasaur.png', alt: 'Bulbasaur' },
        { src: '/assets/images/Pikachu.png', alt: 'Pikachu' },
        { src: '/assets/images/Charizard.png', alt: 'Charizard' },
        { src: 'assets/images/Bulbasaur.png', alt: 'Bulbasaur' },
        { src: 'assets/images/Charizard.png', alt: 'Charizard' },
        { src: 'assets/images/Nidoquen.png', alt: 'Nidoquen' },
        { src: 'assets/images/Piplup.png', alt: 'Piplup' },
        { src: 'assets/images/Pokedex.png', alt: 'Pokedex' },
        { src: 'assets/images/Squirt.png', alt: 'Squirt' },
      ],
           minSize: 54,
           maxSize: 110,
           minOpacity: 0.22,
           maxOpacity: 0.50,
           density: 60,
           zIndex: 1001,
           safePadding: 24,
    });

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
    // Clean up decorative sprite system
    if (globalPokemonSpriteCleanup) globalPokemonSpriteCleanup();
  }

  closeModal() {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent) {
    // Cierra el modal si el click es fuera del cuadro (no dentro del modal)
    const modal = this.modalRoot?.nativeElement;
    if (!modal) return;
    // Si el click NO está dentro del modal, cerrar
    if (!modal.contains(event.target as Node)) {
      this.closeModal();
    }
  }

  // Animación manual eliminada, todo es scroll reveal
}
