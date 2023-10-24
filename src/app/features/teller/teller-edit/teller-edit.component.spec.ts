import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerEditComponent } from './teller-edit.component';

describe('TellerEditComponent', () => {
  let component: TellerEditComponent;
  let fixture: ComponentFixture<TellerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TellerEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TellerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
