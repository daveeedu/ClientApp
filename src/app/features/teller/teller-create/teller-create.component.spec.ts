import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerCreateComponent } from './teller-create.component';

describe('TellerCreateComponent', () => {
  let component: TellerCreateComponent;
  let fixture: ComponentFixture<TellerCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TellerCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TellerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
