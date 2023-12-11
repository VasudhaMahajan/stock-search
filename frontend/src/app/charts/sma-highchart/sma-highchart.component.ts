import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';

declare var require: any;
require('highcharts/indicators/indicators')(Highcharts); // loads core and enables sma
require('highcharts/indicators/volume-by-price')(Highcharts); // loads enables vbp


@Component({
  selector: 'app-sma-highchart',
  templateUrl: './sma-highchart.component.html',
  styleUrls: ['./sma-highchart.component.css']
})
export class SmaHighchartComponent implements OnInit {
  @Input() smaVolumeChartOptions :  any;

  highcharts = Highcharts;

  constructor() { }

  ngOnInit(): void {
  }

}
