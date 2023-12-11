import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationHighchartComponent } from './recommendation-highchart.component';

describe('RecommendationHighchartComponent', () => {
  let component: RecommendationHighchartComponent;
  let fixture: ComponentFixture<RecommendationHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendationHighchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
