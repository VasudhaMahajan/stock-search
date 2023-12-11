import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmaHighchartComponent } from './sma-highchart.component';

describe('SmaHighchartComponent', () => {
  let component: SmaHighchartComponent;
  let fixture: ComponentFixture<SmaHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmaHighchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmaHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
