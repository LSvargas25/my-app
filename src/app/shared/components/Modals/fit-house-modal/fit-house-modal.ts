import { Component, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-fit-house-modal',
  imports: [],
  templateUrl: './fit-house-modal.html',
  styleUrl: './fit-house-modal.scss',
})
export class FitHouseModal implements AfterViewInit, OnDestroy {
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    // No bloquear el scroll global del body ni html
    // Si necesitas scroll interno, usa CSS en el modal
  }

  ngOnDestroy() {
    // No restaurar estilos globales porque no se modifican
  }
}
