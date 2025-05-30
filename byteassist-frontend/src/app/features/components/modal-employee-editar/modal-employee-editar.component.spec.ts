import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEmployeeEditarComponent } from './modal-employee-editar.component';

describe('ModalEmployeeEditarComponent', () => {
  let component: ModalEmployeeEditarComponent;
  let fixture: ComponentFixture<ModalEmployeeEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEmployeeEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEmployeeEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
