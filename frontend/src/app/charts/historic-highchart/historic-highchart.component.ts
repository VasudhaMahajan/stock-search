import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';

declare var require: any;
require('highcharts/indicators/indicators')(Highcharts); // loads core and enables sma
require('highcharts/indicators/volume-by-price')(Highcharts); // loads enables vbp


@Component({
  selector: 'app-historic-highchart',
  templateUrl: './historic-highchart.component.html',
  styleUrls: ['./historic-highchart.component.css']
})
export class HistoricHighchartComponent implements OnInit {

  @Input() historic_chart : any;
  highcharts = Highcharts;
  
  constructor() { }

  ngOnInit(): void {
  }

}
