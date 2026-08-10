import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaDeputados } from './consulta-deputados';

describe('ConsultaDeputados', () => {
  let component: ConsultaDeputados;
  let fixture: ComponentFixture<ConsultaDeputados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaDeputados],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaDeputados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
