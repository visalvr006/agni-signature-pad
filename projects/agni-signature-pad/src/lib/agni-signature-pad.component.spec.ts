import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgniSignaturePadComponent } from './agni-signature-pad.component';

describe('AgniSignaturePadComponent', () => {
  let component: AgniSignaturePadComponent;
  let fixture: ComponentFixture<AgniSignaturePadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgniSignaturePadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgniSignaturePadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
