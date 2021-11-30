import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpresoescolarComponent } from './expresoescolar.component';

describe('ExpresoescolarComponent', () => {
  let component: ExpresoescolarComponent;
  let fixture: ComponentFixture<ExpresoescolarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpresoescolarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpresoescolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
