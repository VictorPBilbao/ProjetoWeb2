import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEmployeeVisualizarComponent } from './modal-employee-visualizar.component';

describe('ModalEmployeeVisualizarComponent', () => {
  let component: ModalEmployeeVisualizarComponent;
  let fixture: ComponentFixture<ModalEmployeeVisualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEmployeeVisualizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEmployeeVisualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
