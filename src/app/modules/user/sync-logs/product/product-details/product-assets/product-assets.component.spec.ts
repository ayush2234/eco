import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAssetsComponent } from './product-assets.component';

describe('ProductAssetsComponent', () => {
  let component: ProductAssetsComponent;
  let fixture: ComponentFixture<ProductAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAssetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
