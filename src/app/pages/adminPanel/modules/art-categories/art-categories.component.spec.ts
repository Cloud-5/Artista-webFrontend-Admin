import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtCategoriesComponent } from './art-categories.component';

describe('ArtCategoriesComponent', () => {
  let component: ArtCategoriesComponent;
  let fixture: ComponentFixture<ArtCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
