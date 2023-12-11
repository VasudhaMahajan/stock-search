import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricHighchartComponent } from './historic-highchart.component';

describe('HistoricHighchartComponent', () => {
  let component: HistoricHighchartComponent;
  let fixture: ComponentFixture<HistoricHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricHighchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
