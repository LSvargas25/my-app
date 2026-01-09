import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexModal } from './pokedex-modal';

describe('PokedexModal', () => {
  let component: PokedexModal;
  let fixture: ComponentFixture<PokedexModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokedexModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
