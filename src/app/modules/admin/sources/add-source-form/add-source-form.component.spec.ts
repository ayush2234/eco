import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSourceFormComponent } from './add-source-form.component';

describe('AddIntegrationFormComponent', () => {
    let component: AddSourceFormComponent;
    let fixture: ComponentFixture<AddSourceFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddSourceFormComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AddSourceFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
