import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIntegrationFormComponent } from './add-integration-form.component';

describe('AddIntegrationFormComponent', () => {
  let component: AddIntegrationFormComponent;
  let fixture: ComponentFixture<AddIntegrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIntegrationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIntegrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
