import { Component, AfterViewInit, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokedexModal } from '../../shared/components/Modals/pokedex-modal/pokedex-modal'; import { ExpandeModal } from '../../shared/components/Modals/expande-modal/expande-modal';
import { FitHouseModal } from '../../shared/components/Modals/fit-house-modal/fit-house-modal';
import  { ProfileCardComponent} from  '../../features/home/ProfileCard/profile-card-component/profile-card-component';
// GSAP/ScrollTrigger/tsParticles types (for SSR safety)
declare const window: any;
declare const gsap: any;
declare const ScrollTrigger: any;
// tsParticles is loaded via CDN or as a global
let tsParticles: any = undefined;

// (Removed invalid TypeScript module augmentation for gsap/ScrollTrigger)
import { VcBikeServiceModal } from '../../shared/components/Modals/vc-bike-service-modal/vc-bike-service-modal';
import { Footer } from '../../shared/components/Footer/footer/footer';
// import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Removed for SSR/TS compatibility
import { BaseProjectModalComponent } from '../../shared/components/Modals/base-project-modal/base-project-modal.component/base-project-modal.component';

type SoftSkill = {
  name: string;
  icon: string;
};

type Expertise = {
  name: string;
  iconPath: string;   // ruta en assets
  colorClass: string;
  delayClass?: string;
};


type Skill = {
  name: string;
  logo: string; // principal
  fallbackLogo: string; // respaldo
};
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Footer, BaseProjectModalComponent, PokedexModal, ExpandeModal, FitHouseModal, VcBikeServiceModal, ProfileCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
    // private lastScrollTop = 0;
    // private scrollListener?: () => void;
  private projectsObserver?: IntersectionObserver;

  showPokedexModal = false;
  showExpandeModal = false;
  showFitHouseModal = false;
  showVcBikeServiceModal = false;

  openModal(modal: 'pokedex' | 'expande' | 'fit' | 'vcbike') {
    this.closeAllModals();
    if (modal === 'pokedex') this.showPokedexModal = true;
    if (modal === 'expande') this.showExpandeModal = true;
    if (modal === 'fit') this.showFitHouseModal = true;
    if (modal === 'vcbike') this.showVcBikeServiceModal = true;
  }

  closeAllModals() {
    this.showPokedexModal = false;
    this.showExpandeModal = false;
    this.showFitHouseModal = false;
    this.showVcBikeServiceModal = false;
  }

expertiseItems: Expertise[] = [
  {
    name: 'Backend Engineering',
    iconPath: 'assets/images/Ico1.png',
    colorClass: 'text-blue-600',
  },
  {
    name: 'System Design & Architecture',
    iconPath: 'assets/images/Ico2.png',
    colorClass: 'text-cyan-600',
    delayClass: 'delay-150',
  },
  {
    name: 'Clean Architecture & SOLID',
    iconPath: 'assets/images/Ico3.png',
    colorClass: 'text-sky-600',
    delayClass: 'delay-300',
  },
];


  softSkills: SoftSkill[] = [
    {
      name: 'Customer Focus',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/salesforce.svg',
    },

    {
      name: 'Critical Thinking',
      icon: 'https://cdn.simpleicons.org/abstract/000000',
    },
    {
      name: 'Attention to Detail',
      icon: 'https://cdn.simpleicons.org/checkmarx/000000',
    },
    {
      name: 'Problem Solving',
      icon: 'https://cdn.simpleicons.org/target/000000',
    },
    {
      name: 'Continuous Learning',
      icon: 'https://cdn.simpleicons.org/codecademy/000000',
    },
    {
      name: 'Team Collaboration',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/microsoftteams.svg',
    },
    {
      name: 'Communication Skills',
      icon: 'https://cdn.simpleicons.org/googlechat/000000',
    },
    {
      name: 'Adaptability',
      icon: 'https://cdn.simpleicons.org/airbyte/000000',
    },
    {
      name: 'Time Management',
      icon: 'https://cdn.simpleicons.org/clockify/000000',
    },
    {
      name: 'Responsibility',
      icon: 'https://cdn.simpleicons.org/trustpilot/000000',
    },
    {
      name: 'Work Ethic',
      icon: 'https://cdn.simpleicons.org/opensourceinitiative/000000',
    },
    {
      name: 'Analytical Mindset',
      icon: 'https://cdn.simpleicons.org/databricks/000000',
    },
  ];

  skills: Skill[] = [
    // Backend / .NET
    {
      name: 'C#',
      logo: 'https://cdn.simpleicons.org/csharp/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/csharp.svg',
    },
    {
      name: '.NET',
      logo: 'https://cdn.simpleicons.org/dotnet/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/dotnet.svg',
    },
    {
      name: 'ASP.NET Core',
      logo: 'https://cdn.simpleicons.org/dotnet/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/dotnet.svg',
    },

    // Frontend
    {
      name: 'Angular',
      logo: 'https://cdn.simpleicons.org/angular/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/angular.svg',
    },
    {
      name: 'TypeScript',
      logo: 'https://cdn.simpleicons.org/typescript/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/typescript.svg',
    },
    // Databases
    {
      name: 'SQL Server',
      logo: 'https://cdn.simpleicons.org/microsoftsqlserver/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/microsoftsqlserver.svg',
    },
    {
      name: 'Oracle',
      logo: 'https://cdn.simpleicons.org/oracle/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/oracle.svg',
    },
    {
      name: 'MongoDB',
      logo: 'https://cdn.simpleicons.org/mongodb/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/mongodb.svg',
    },
    {
      name: 'NoSQL',
      // Representación genérica del paradigma NoSQL
      logo: 'https://cdn.simpleicons.org/apachecassandra/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/apachecassandra.svg',
    },

    // Web basics
    {
      name: 'HTML5',
      logo: 'https://cdn.simpleicons.org/html5/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/html5.svg',
    },
    {
      name: 'CSS3',
      // OJO: el slug correcto es "css" (no css3)
      logo: 'https://cdn.simpleicons.org/css/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/css3.svg',
    },
    {
      name: 'JavaScript',
      logo: 'https://cdn.simpleicons.org/javascript/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/javascript.svg',
    },
    {
      name: 'Tailwind CSS',
      logo: 'https://cdn.simpleicons.org/tailwindcss/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tailwindcss.svg',
    },

    // Mobile
    {
      name: 'Xamarin.Forms',
      logo: 'https://cdn.simpleicons.org/xamarin/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/xamarin.svg',
    },

    // Backend extra
    {
      name: 'PHP',
      logo: 'https://cdn.simpleicons.org/php/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/php.svg',
    },
    {
      name: 'Laravel',
      logo: 'https://cdn.simpleicons.org/laravel/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/laravel.svg',
    },

    // DevOps
    {
      name: 'Docker',
      logo: 'https://cdn.simpleicons.org/docker/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/docker.svg',
    },

    // VCS / Tools
    {
      name: 'Git',
      logo: 'https://cdn.simpleicons.org/git/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/git.svg',
    },
    {
      name: 'GitHub',
      logo: 'https://cdn.simpleicons.org/github/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg',
    },
    {
      name: 'Postman',
      logo: 'https://cdn.simpleicons.org/postman/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/postman.svg',
    },
    {
      name: 'Swagger',
      logo: 'https://cdn.simpleicons.org/swagger/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/swagger.svg',
    },

    // IDEs
    {
      name: 'Visual Studio',
      logo: 'https://cdn.simpleicons.org/visualstudio/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/visualstudio.svg',
    },
    {
      name: 'VS Code',
      logo: 'https://cdn.simpleicons.org/visualstudiocode/000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/visualstudiocode.svg',
    },
  ];

  // Getters para agrupar skills por categoría
  get frontendSkills() {
    return this.skills.filter((s) =>
      ['Angular', 'TypeScript', 'HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS'].includes(s.name)
    );
  }

  get backendSkills() {
    return this.skills.filter((s) =>
      ['C#', '.NET', 'ASP.NET Core', 'PHP', 'Laravel', 'Xamarin.Forms', 'Docker'].includes(s.name)
    );
  }

  get databaseSkills() {
    return this.skills.filter((s) => ['SQL Server', 'Oracle', 'MongoDB', 'NoSQL'].includes(s.name));
  }

  get toolsSkills() {
    return this.skills.filter((s) =>
      ['Git', 'GitHub', 'Postman', 'Swagger', 'Visual Studio', 'VS Code'].includes(s.name)
    );
  }

  /**
   * Si el logo principal falla, cambia al fallback automáticamente.
   */
  onSkillImgError(skill: Skill, ev: Event): void {
    const img = ev.target as HTMLImageElement;

    // Evita loop infinito si también falla el fallback
    if (img.src === skill.fallbackLogo) return;

    img.src = skill.fallbackLogo;
  }

  // -----------------------------
  // TYPEWRITER CONFIG
  // -----------------------------
  words: string[] = [
    'Software Developer',
    'Frontend Developer',
    'Backend Developer',
    'Database Developer',
  ];

  currentWordIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;

  typingSpeed = 100;
  deletingSpeed = 60;
  pauseAfterTyping = 1200;

  gsapRegistered = false;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  // -----------------------------
  // LIFECYCLE
  // -----------------------------
  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    this.startTypewriter();

    // Register ScrollTrigger plugin if available
    if (window.gsap && window.ScrollTrigger && window.gsap.registerPlugin) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    // Defer GSAP/DOM logic to next tick for SSR safety
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.initHeroAnimations();
        this.initParticlesBackground();
        this.initProfileCard3D();
        this.initResumeBtnAnimation();
        this.initScrollCue();
        this.initGsapBlocks();
        this.initProjectsObserver();
      }, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.projectsObserver) {
      this.projectsObserver.disconnect();
    }
    // Clean up listeners if needed
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this.profileCardTiltHandler as any);
    }
  }

  // ================= HERO ANIMATIONS =================
  private initHeroAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    // 1. Staggered entrance for hero texts
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .to('#hero-im', { opacity: 1, y: 0, duration: 0.9 })
      .to('#hero-typewriter-wrap', { opacity: 1, scale: 1, duration: 0.8 }, '-=0.5')
      .fromTo(
        '#profile-card',
        { opacity: 0, y: 64, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' },
        '-=0.4'
      );
  }

  private initGsapBlocks() {
    // Animate .gsap-fade blocks on scroll (if any)
    if (!window.gsap || !window.ScrollTrigger) return;
    const blocks = this.el.nativeElement.querySelectorAll('.gsap-fade');
    blocks.forEach((block: HTMLElement) => {
      gsap.fromTo(
        block,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: block,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }

  // 2. Animated background (gradient mesh or tsParticles)
  private initParticlesBackground() {
    const bg = document.getElementById('hero-bg-anim');
    if (!bg) return;
    // SSR fallback: just gradient
    if (typeof window === 'undefined') return;
    // Try to use tsParticles if available
    tsParticles = window.tsParticles || undefined;
    if (tsParticles && tsParticles.load) {
      tsParticles.load('hero-bg-anim', {
        fpsLimit: 30,
        background: { color: 'transparent' },
        particles: {
          number: { value: 24, density: { enable: true, area: 800 } },
          color: { value: ['#2563eb', '#06b6d4', '#e0f2fe'] },
          opacity: { value: 0.13, random: true },
          size: { value: 32, random: { enable: true, minimumValue: 12 } },
          move: {
            enable: true,
            speed: 0.25,
            direction: 'none',
            outModes: { default: 'out' },
          },
          shape: { type: 'circle' },
        },
        detectRetina: true,
      });
    }
    // If not, fallback to static gradient (already in CSS)
  }

  // 3. 3D Tilt, Floating, and Animated Ring
  private profileCardTiltHandler: ((e: MouseEvent) => void) | null = null;
  private initProfileCard3D() {
    const card = document.getElementById('profile-card');
    if (!card) return;
    // 3D tilt on mouse move (desktop only)
    this.profileCardTiltHandler = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * -10;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    card.addEventListener('mousemove', this.profileCardTiltHandler);
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
    // (Floating and animated ring are handled by CSS)
  }

  // 4. Premium Resume Button Animation
  private initResumeBtnAnimation() {
    const resumeBtn = document.getElementById('downloadResumeBtn');
    if (!resumeBtn || !window.gsap) return;
    resumeBtn.addEventListener('click', () => {
      const text = resumeBtn.querySelector('.resume-text') as HTMLElement;
      const icon = resumeBtn.querySelector('.resume-icon') as HTMLElement;
      // Prevent double click
      resumeBtn.setAttribute('disabled', 'true');
      // Download animation
      gsap.timeline()
        .to(icon, {
          y: 6,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
        })
        .to(text, {
          opacity: 0,
          duration: 0.2,
        }, '<')
        .add(() => {
          text.textContent = 'Downloading...';
          icon.textContent = '⏳';
        })
        .to([text, icon], {
          opacity: 1,
          y: 0,
          duration: 0.25,
        })
        .to({}, { duration: 0.8 }) // fake download delay
        .add(() => {
          text.textContent = 'Downloaded';
          icon.textContent = '✔️';
          // Trigger real download
          const link = document.createElement('a');
          link.href = resumeBtn.getAttribute('href') || 'assets/Steven.Resumen.pdf';
          link.download = resumeBtn.getAttribute('download') || 'Steven.Resumen.pdf';
          link.click();
        })
        .to(resumeBtn, {
          boxShadow: '0 0 20px rgba(34,197,94,0.6)',
          duration: 0.3,
        })
        .add(() => {
          // Reset after a short delay
          setTimeout(() => {
            text.textContent = 'Download Resume';
            icon.textContent = '⬇️';
            resumeBtn.removeAttribute('disabled');
            gsap.to(resumeBtn, { boxShadow: '0 2px 16px #3b82f640', duration: 0.3 });
          }, 1200);
        });
    });
  }

  // 5. Scroll Cue Animation
  private initScrollCue() {
    const cue = document.getElementById('scroll-cue');
    if (!cue || !window.gsap) return;
    gsap.to(cue, { opacity: 1, y: 0, duration: 1.2, delay: 1.2, ease: 'power3.out' });
  }

  // 6. Projects Section Modal Observer (unchanged)
  private initProjectsObserver() {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      this.projectsObserver = new IntersectionObserver(
        (entries) => {
          const isAnyModalOpen =
            this.showPokedexModal ||
            this.showExpandeModal ||
            this.showFitHouseModal ||
            this.showVcBikeServiceModal;
          if (isAnyModalOpen) return;
          if (entries[0] && entries[0].intersectionRatio === 0) {
            this.closeAllModals();
          }
        },
        { threshold: 0 }
      );
      this.projectsObserver.observe(projectsSection);
    }
  }
    // ngOnDestroy handled above

  // -----------------------------
  // TYPEWRITER LOGIC
  // -----------------------------
  private startTypewriter(): void {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const currentWord = this.words[this.currentWordIndex];

    if (!this.isDeleting) {
      element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;

      if (this.currentCharIndex === currentWord.length) {
        setTimeout(() => (this.isDeleting = true), this.pauseAfterTyping);
      }
    } else {
      element.textContent = currentWord.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;

      if (this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
      }
    }

    setTimeout(
      () => this.startTypewriter(),
      this.isDeleting ? this.deletingSpeed : this.typingSpeed
    );
  }




}
