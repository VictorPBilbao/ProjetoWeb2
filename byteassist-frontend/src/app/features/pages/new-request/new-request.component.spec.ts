import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRequestComponent } from './new-request.component';

describe('NewRequestComponent', () => {
  let component: NewRequestComponent;
  let fixture: ComponentFixture<NewRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
