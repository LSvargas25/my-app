import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandeModal } from './expande-modal';

describe('ExpandeModal', () => {
  let component: ExpandeModal;
  let fixture: ComponentFixture<ExpandeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandeModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandeModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
