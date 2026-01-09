import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitHouseModal } from './fit-house-modal';

describe('FitHouseModal', () => {
  let component: FitHouseModal;
  let fixture: ComponentFixture<FitHouseModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitHouseModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FitHouseModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
