import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";

// Importar AOS
import AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet]
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-in-out',
    });
  }
}
