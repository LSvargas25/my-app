import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit {

  // -----------------------------
  // TYPEWRITER CONFIGURATION
  // -----------------------------
  words: string[] = [
    'Software Developer',
    'Frontend Developer',
    'Backend Developer',
    'Database Developer'
  ];

  currentWordIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;

  typingSpeed = 100;
  deletingSpeed = 60;
  pauseAfterTyping = 1200;

  // -----------------------------
  // LIFECYCLE
  // -----------------------------
  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.startTypewriter();
    }
  }

  // -----------------------------
  // TYPEWRITER LOGIC
  // -----------------------------
  private startTypewriter(): void {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const currentWord = this.words[this.currentWordIndex];

    if (!this.isDeleting) {
      // Typing
      element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;

      if (this.currentCharIndex === currentWord.length) {
        setTimeout(() => {
          this.isDeleting = true;
        }, this.pauseAfterTyping);
      }
    } else {
      // Deleting
      element.textContent = currentWord.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;

      if (this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentWordIndex =
          (this.currentWordIndex + 1) % this.words.length;
      }
    }

    setTimeout(
      () => this.startTypewriter(),
      this.isDeleting ? this.deletingSpeed : this.typingSpeed
    );
  }
}
