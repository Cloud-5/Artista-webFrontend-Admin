import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistRequestsComponent } from './artist-requests.component';

describe('ArtistRequestsComponent', () => {
  let component: ArtistRequestsComponent;
  let fixture: ComponentFixture<ArtistRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtistRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtistRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
