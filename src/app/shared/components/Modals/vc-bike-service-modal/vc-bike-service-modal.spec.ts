import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VcBikeServiceModal } from './vc-bike-service-modal';

describe('VcBikeServiceModal', () => {
  let component: VcBikeServiceModal;
  let fixture: ComponentFixture<VcBikeServiceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VcBikeServiceModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VcBikeServiceModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
