import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';

declare var require: any;
require('highcharts/indicators/indicators')(Highcharts); // loads core and enables sma
require('highcharts/indicators/volume-by-price')(Highcharts); // loads enables vbp


@Component({
  selector: 'app-recommendation-highchart',
  templateUrl: './recommendation-highchart.component.html',
  styleUrls: ['./recommendation-highchart.component.css']
})
export class RecommendationHighchartComponent implements OnInit {
  @Input() recommendationchart : any;

  highcharts = Highcharts;
  constructor() { }

  ngOnInit(): void {
  }

}
