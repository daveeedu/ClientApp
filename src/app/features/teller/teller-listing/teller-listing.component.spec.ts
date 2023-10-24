import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerListingComponent } from './teller-listing.component';

describe('TellerListingComponent', () => {
  let component: TellerListingComponent;
  let fixture: ComponentFixture<TellerListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TellerListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TellerListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
