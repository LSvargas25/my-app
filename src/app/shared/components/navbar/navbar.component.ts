import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  sections = [
    { id: 'hero', label: 'Home' },
    { id: 'profile', label: 'Profile' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'about-me', label: 'About me' },
    { id: 'contact', label: 'Contact' }
  ];

  activeSection = 'hero';
  highlightProfile = true;

  ngOnInit() {
    // Glow inicial
    setTimeout(() => {
      this.highlightProfile = false;
    }, 2500);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.highlightProfile = true;

    setTimeout(() => {
      this.highlightProfile = false;
    }, 1200);

    for (const section of this.sections) {
      const el = document.getElementById(section.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom > 80) {
          this.activeSection = section.id;
          break;
        }
      }
    }
  }

  scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70; // Altura del navbar fijo
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
