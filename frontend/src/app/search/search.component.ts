import { Component, OnInit, ViewChild } from '@angular/core';
import { Service } from '../config/service';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsModalComponent } from '../modals/news-modal/news-modal.component';
import { News } from '../config/news';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter, map, startWith, concatMap } from 'rxjs/operators';
import { interval } from 'rxjs';
import * as Highcharts from 'highcharts/highstock';
import { LocalstorageService } from '../config/localstorage.service';
import { LoadingService } from '../config/loading.service';
import { PortfolioModalComponent } from '../modals/portfolio-modal/portfolio-modal.component';
import { StateService } from '../config/state.service';

declare var require: any;
require('highcharts/indicators/indicators')(Highcharts); // loads core and enables sma
require('highcharts/indicators/volume-by-price')(Highcharts); // loads enables vbp


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  news: News[] = [];
  prices: any = {};
  description: any = {};
  peers: any = [];
  symbol: any = null;
  myControl = new FormControl();

  options: any = [{
    "description": "",
    "displaySymbol": "",
    "symbol": "",
    "type": ""
  }]

  filteredOptions: any;
  isLoading = false;

  highcharts = Highcharts;


  chartOptions: any;
  chartData: any = [];

  //sma chart
  smaVolumeChartData: any;
  smaVolumeChartOptions: any;
  sma_chart_data: any = [];

  //earnnings
  stock_e: any = [];
  historic_chart: any;

  //social sentiment
  social_sentiment: any = [];
  reddittotal = 0;
  redditpos = 0;
  redditneg = 0;
  twittertotal = 0;
  twitterpos = 0;
  twitterneg = 0;

  //recommendation
  recommendation: any = [];
  recommendationchart: any;

  currentimestamp: any;
  timestampForChart: any;

  isMarketOpen: any;
  isDataLoadCompleted = false;

  loading$ = this.loader.loading$;

  private _success = new Subject<string>();
  private _error = new Subject<string>();
  private _success1 = new Subject<string>();
  private _error1 = new Subject<string>();
  @ViewChild('selfClosingAlert', { static: false })
  selfClosingAlert!: NgbAlert;
  successMessage = '';
  errorMessage = '';
  issuccessful: any = true;
  alertcolor = "";
  watchlistsuccessMessage = "";
  watchlisterrorMessage = "";

  //watchlist
  watchlist: any = [];
  temp = {
    "symbol": "",
    "symbolname": "",
    "c": 0,
    "d": 0,
    "dp": 0
  }

  isSellEnabled: boolean = false;
  iswatchlisted: boolean = false;

  inpStockTicker : string = "";

  constructor(private service: Service, private modalService: NgbModal, private route: ActivatedRoute, private router: Router,
    private fb: FormBuilder, private localstorage: LocalstorageService, public loader: LoadingService, private stateservice: StateService) {
    this.symbol = this.route.snapshot.params['ticker'];
    stateservice.globalsymbol = this.symbol;
    //-changes
    this.localstorage.set("symbol", this.route.snapshot.params['ticker']);
    console.log(this.symbol + " symbol");
    this.currentimestamp = Math.floor(Date.now() / 1000);

    if (this.localstorage.get("portfolio")) {
      let lsp = JSON.parse(this.localstorage.get("portfolio"));
      for (let result of lsp) {
        if (result.folioTicker == this.symbol) {
          this.isSellEnabled = true;
        }
      }
    }
    if (this.symbol != "home") {
      if(this.localstorage.get("inpStockTicker")){
        this.inpStockTicker = JSON.parse(this.localstorage.get("inpStockTicker"));
      }
      this.callAPIs();
    }
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    if (this.localstorage.get("watchlist") != null && this.localstorage.get('watchlist') != '[]') {
      this.watchlist = JSON.parse(this.localstorage.get("watchlist"));
      for (let wl of this.watchlist) {
        if (wl.symbol == this.symbol) {
          this.iswatchlisted = true;
        }
      }
    }
  }

  checkifstockpresentinportfolio() {
    this.isSellEnabled = false;
    if (this.localstorage.get("portfolio")) {
      let lsp = JSON.parse(this.localstorage.get("portfolio"));
      for (let result of lsp) {
        if (result.folioTicker == this.symbol) {
          this.isSellEnabled = true;
        }
      }
    }
  }

  clearAndRoute(){
    this.localstorage.remove("inpStockTicker");
    this.router.navigateByUrl("/");
  }

  ngOnInit() {
    this.localstorage.set("symbol", this.route.snapshot.params['ticker']);
    this.myControl.valueChanges.pipe(
      filter(res => {
        return res !== null && res.length >= 1
      }),
      distinctUntilChanged(),
      debounceTime(1000),
      tap(() => {
        this.filteredOptions = [],
          this.isLoading = true;
      }),
      switchMap(value => this.service.getAutocompleteSuggestion(value.toUpperCase())
        .pipe(
          finalize(() => {
            
            this.isLoading = false
          }),
        ))
    ).subscribe((data: any) => {
      if (data) {
        this.filteredOptions = data.data;
        console.log(this.filteredOptions);
      } else {
        this.filteredOptions = [];
      }

    });
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });

    this._error.subscribe(message => this.errorMessage = message);
    this._error.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });

    this._success1.subscribe(message => this.watchlistsuccessMessage = message);
    this._success1.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });

    this._error1.subscribe(message => this.watchlisterrorMessage = message);
    this._error1.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });

    interval(15000).subscribe(x => {
      this.currentimestamp = Math.floor(Date.now() / 1000);
      if (this.isMarketOpen)
        this.getLatestPriceAndChartSummary();
    });
  }

  public changeSuccessMessage(alertcolor: any, message: string) {
    this.alertcolor = alertcolor;
    this._success.next(message);
  }

  public changeErrorMessage(message: string) { this._error.next(message) }

  public changeWLSuccessMessage(message: string) { this._success1.next(message); }

  public changeWLErrorMessage(message: string) { this._error1.next(message) }

  openModal(n: News) {
    const modalRef = this.modalService.open(NewsModalComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
      });

    modalRef.componentInstance.fromParent = n;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
    });
  }

  addtowatchlist() {
    if (this.localstorage.get('watchlist') == null) {
      this.temp.symbol = this.symbol;
      this.temp.symbolname = this.description.name;
      this.temp.c = this.prices.c;
      this.temp.d = this.prices.d;
      this.temp.dp = this.prices.dp;
      this.watchlist.push(this.temp);
      this.localstorage.set('watchlist', this.watchlist);
    } else {
      this.watchlist = JSON.parse(this.localstorage.get("watchlist"));
      this.temp.symbol = this.symbol;
      this.temp.symbolname = this.description.name;
      this.temp.c = this.prices.c;
      this.temp.d = this.prices.d;
      this.temp.dp = this.prices.dp;
      this.watchlist.push(this.temp);
      this.localstorage.set('watchlist', this.watchlist);
    }
    this.iswatchlisted = true;
    this.changeWLSuccessMessage(this.symbol.toUpperCase() + " added to Watchlist.");
  }

  removefromwatchlist() {
    let idx = 0;
    for (let i = 0; i < this.watchlist.length; i++) {
      if (this.watchlist[i].symbol == this.symbol) {
        idx = i;
      }
    }
    this.watchlist.splice(idx, 1);
    this.localstorage.set('watchlist', this.watchlist);
    console.log(JSON.parse(this.localstorage.get("watchlist")));
    this.iswatchlisted = false;
    this.changeWLErrorMessage(this.symbol + " removed from Watchlist.")
  }

  searchStockAuto(symbol: string) {
    this.symbol = symbol;
    this.localstorage.set("inpStockTicker", this.symbol);
    if (symbol == null || symbol == '') {
      this.isDataLoadCompleted = true;
      this.changeErrorMessage("Please enter a valid ticker");
      this.issuccessful = false;
    } else {
      this.router.navigateByUrl("/search/" + this.symbol.toUpperCase());
    }
  }

  searchStock() {
    this.symbol = this.myControl.value;
    this.localstorage.set("inpStockTicker", this.symbol);
    if (this.symbol == null || this.symbol == '') {
      this.isDataLoadCompleted = true;
      this.changeErrorMessage("Please enter a valid ticker");
      this.issuccessful = false;
    } else {
      this.router.navigateByUrl("/search/" + this.symbol.toUpperCase());
    }
  }


  callAPIs() {

    this.service.getTopNews(this.symbol).subscribe(data => {  //pending
      this.news = data.data;
    });

    this.service.getDescription(this.symbol).subscribe(data => {

      console.log(data.data);
      if (Object.keys(data.data).length == 0) {
        this.isDataLoadCompleted = true;
        this.changeErrorMessage("No data found. Please enter a valid Ticker");
        this.issuccessful = false;
      } else {
        this.description = data.data;
      }
    });

    this.service.getPeers(this.symbol).subscribe(data => {
      this.peers = data.data;
      console.log(this.peers)
    });

    console.log(this.route.snapshot.params);

    this.getLatestPriceAndChartSummary();

    this.getSMAVolumeChart();
    this.getsocialfromAPI();
    this.getrecommendations();
    this.getEarningsChartData();

  }

  buyStock(symbol: string, symbolname: string, buySell: string) {
    const modalRef = this.modalService.open(PortfolioModalComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
      });

    modalRef.componentInstance.symbol = symbol;
    modalRef.componentInstance.symbolname = symbolname;
    modalRef.componentInstance.buySell = buySell;

    modalRef.result.then((data) => {
      if (data) {
        if (buySell == 'buy') {
          this.changeSuccessMessage('success', this.symbol.toUpperCase() + " bought successfully.");
          this.isSellEnabled = true;
        }
        else {
          this.changeSuccessMessage('danger', this.symbol.toUpperCase() + " sold successfully.");
          this.checkifstockpresentinportfolio();
        }
        
      }
    });
  }

  getLatestPriceAndChartSummary() {
    this.service.getLatestPrice(this.symbol).subscribe(data => {
      // this.prices.h = data.data.h;
      // this.prices.l = data.data.l;
      // this.prices.o = data.data.o;
      // this.prices.pc = data.data.pc;
      this.prices = data.data;
      console.log("ccuTS: " + this.currentimestamp);
      console.log("t: " + data.data.t);


      if (this.currentimestamp - data.data.t > 300) {
        this.isMarketOpen = false;
        this.timestampForChart = data.data.t;
      } else {
        this.isMarketOpen = true;
        this.timestampForChart = this.currentimestamp;
        console.log(this.isMarketOpen);
      }
      let color = "#008000";
      if (data.data.d < 0) {
        color = "#ff0000";
      }
      else if (data.data.d == 0) {
        color = "#000000";
      }
      this.service.getChartSummaryTab(this.symbol, this.timestampForChart).subscribe((data: any) => {
        console.log(data);
        this.chartData = data.data;
        this.chartOptions = {
          chart: {
            type: "spline",
          },
          time: {
            useUTC: false,
            timezone: 'America/Los_Angeles',
          },
          title: {
            text: this.symbol + ' Hourly Price Variation',
            style: {
              fontSize: '13px',
              color: 'gray'
            }
          },
          xAxis: {
            type: 'datetime',
            labels: {
              style: {
                fontSize: '8px'
              }
            },

            crosshair: true
          },
          scrollbar: {
            enabled: true
          },
          legend: { enabled: false },
          yAxis: {
            title: {
              text: null
            },
            labels: {
              style: {
                fontSize: '8px'
              },
              x : -2,
              y : -2,
              align : "right"
            },
            opposite: true,

          },
          tooltip: {
            valueSuffix: "",
            split: true
          },
          plotOptions: {
            spline: {
              marker: {
                enable: false
              }
            }
          },
          series: [{
            name: this.symbol,
            type: 'line',
            data: this.chartData,
            marker: {
              enabled: false
            },
            color: color,
          }]
        };
        
      });
      this.isDataLoadCompleted = true;
      console.log(this.prices);
    });
  }
  getSMAVolumeChart() {
    this.service.getSMAVolumeChartTab(this.symbol).subscribe((data: any) => {

      this.sma_chart_data = data.data;
      console.log(this.sma_chart_data);
      let volume = [];
      let ohlc = [];

      for (let index = 0; index < this.sma_chart_data.t.length; index++) {
        ohlc.push([
          this.sma_chart_data.t[index] * 1000,
          this.sma_chart_data.o[index],
          this.sma_chart_data.h[index],
          this.sma_chart_data.l[index],
          this.sma_chart_data.c[index]

        ]);
        volume.push([
          this.sma_chart_data.t[index] * 1000,
          this.sma_chart_data.v[index]
        ]);
      }

      this.smaVolumeChartOptions = {
        series: [{
          type: 'candlestick',
          name: this.symbol,
          id: this.symbol,
          zIndex: 2,
          data: ohlc
        }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1
        }, {
          type: 'vbp',
          linkedTo: this.symbol,
          params: {
            volumeSeriesID: 'volume'
          },
          dataLabels: {
            enabled: false
          },
          zoneLines: {
            enabled: false
          }
        }, {
          type: 'sma',
          linkedTo: this.symbol,
          zIndex: 1,
          marker: {
            enabled: false
          }
        }], chart: {
          type: 'candlestick',
        },
        time: {
          useUTC: false,
          timezone: "America/Los_Angeles"
        },
        title: {
          text: this.symbol + " Historical",
          style: {
            fontSize: '1.5em'
          }
        },
        subtitle: {
          text: "With SMA and Volume by Price technical indicators",
          style: {
            fontSize: '1em'
          }
        },
        yAxis: [
          {
            opposite: true,
            startOnTick: false,
            endOnTick: false,
            labels: {
              x: -5,
              y: -2,
              align: "right"
            },
            title: {
              text: 'OHLC'
            },
            height: '58%',
            lineWidth: 2,
            resize: {
              enabled: true
            }
          }, {
            opposite: true,
            labels: {
              x: -5,
              y: -2,
              align: "right"
            },
            title: {
              text: 'Volume'
            },
            top: '63%',
            height: '37%',
            offset: 0,
            lineWidth: 2
          }],
        xAxis: {
          ordinal: true,
          type: "datetime"
        },
        tooltip: {
          xDateFormat: '%B, %d %Y',
          split: true
        },
        plotOptions: {
          series: {
            dataGrouping: {
              enabled: true
            },
            animation: {
              duration: 4000
            }
          }
        },
        scrollbar: {
          enabled: true
        },
        navigator: {
          enabled: true
        },
        lang: {
          rangeSelectorFrom: 'From',
          rangeSelectorTo: 'To'
        },
        rangeSelector: {
          labelStyle: {
            fontSize: '0.7em'
          },
          enabled: true,
          buttonTheme: { // styles for the buttons
            fill: 'none',
            stroke: 'none',
            'stroke-width': 0,
            style: {
              fontSize: '0.7em'
            }
          },
          inputBoxBorderColor: 'gray',
          inputBoxWidth: 120,
          inputBoxHeight: 18,
          buttons: [
            {
              type: 'month',
              count: 1,
              text: '1m',
            },
            {
              type: 'month',
              count: 3,
              text: '3m',
            },
            {
              type: 'month',
              count: 6,
              text: '6m',
            },
            {
              type: 'ytd',
              text: 'YTD',
            },
            {
              type: 'year',
              count: 1,
              text: '1y',
            },
            {
              type: 'all',
              text: 'All',
            },
          ],
          selected: 2,
        },
        legend: {
          enabled: false
        }
      };

    });
  }
  getsocialfromAPI() {
    this.service.getSocialSentimentsInsightsTab(this.symbol).subscribe((response: any) => {
      this.social_sentiment = response.data;

      for (var count = 0; count < this.social_sentiment.reddit.length; count++) {
        this.reddittotal += this.social_sentiment.reddit[count].mention;
        this.redditpos += this.social_sentiment.reddit[count].positiveMention;
        this.redditneg += this.social_sentiment.reddit[count].negativeMention;
      }

      for (var count_t = 0; count_t < this.social_sentiment.twitter.length; count_t++) {
        this.twittertotal += this.social_sentiment.twitter[count_t].mention;
        this.twitterpos += this.social_sentiment.twitter[count_t].positiveMention;
        this.twitterneg += this.social_sentiment.twitter[count_t].negativeMention;
      }
    });
  }

  getrecommendations() {
    this.service.getRecommendationsInsightsTab(this.symbol).subscribe((response) => {
      this.recommendation = response.data;
      console.log(response);
      var strongBuy = [];
      var buy = [];
      var hold = [];
      var sell = [];
      var strongSell = [];
      var dateForChart = [];
      var i;

      var dataLength = this.recommendation.length;

      for (i = 0; i < dataLength; i += 1) {
        strongBuy.push([this.recommendation[i].strongBuy,]);
        buy.push([this.recommendation[i].buy,]);
        hold.push([this.recommendation[i].hold,]);
        sell.push([this.recommendation[i].sell,]);
        strongSell.push([this.recommendation[i].strongSell,])
        dateForChart.push([this.recommendation[i].period.slice(0, 7),]);
      }

      this.recommendationchart = {
        chart: {
          type: 'column',
          marginBottom: 80,

        },
        title: {
          text: 'Recommendation Trends'
        },

        legend: {
          align: 'center',
          verticalAlign: 'bottom',
          x: 0,
          y: 0,
          floating: true,
          borderWidth: 1,
          enabled: true,
          borderColor: '#FFFFFF',
          backgroundColor: (
            (Highcharts.theme) ||
            '#FFFFFF'),
          shadow: false
        },
        xAxis: {
          categories: dateForChart,
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: '#Analysis',
            align: 'high'
          },
          labels: {
            overflow: 'justify'
          }
        },
        tooltip: {

        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          },
          series: {
            stacking: 'normal'
          }
        },
        credits: {
          enabled: false
        },
        colors: ['#186f37', '#1cb955', '#b98b1d', '#f45b5c', '#803131'],
        series:
          [
            {
              name: 'Strong Buy',
              data: strongBuy,
            },
            {
              name: 'Buy',
              data: buy,
            },
            {
              name: 'Hold',
              data: hold,
            },
            {
              name: 'Sell',
              data: sell,
            },
            {
              name: 'Strong Sell',
              data: strongSell
            },
          ]
      };
    });
  }

  getEarningsChartData() {
    this.service.getEarningsInsightsTab(this.symbol).subscribe((response: any) => {
      this.stock_e = response.data;
      console.log(this.stock_e[0]);

      let period_data = [];
      let data_actual = [];
      let data_surprise = [];
      let data_estimate = [];
      let val_x = [];

      for (var u = 0; u < this.stock_e.length; u++) {
        period_data.push([
          this.stock_e[u].period,
        ]);
        data_actual.push([
          this.stock_e[u].actual,
        ]);
        data_surprise.push([
          this.stock_e[u].surprise,
        ]);

        data_estimate.push([
          this.stock_e[u].estimate,
        ]);
      }
      for (var v = 0; v < this.stock_e.length; v++) {
        let s = period_data[v][0] + '<br>Surprise: ' + data_surprise[v][0]
        val_x.push(s);

      }
      let p1 = period_data[0];
      this.historic_chart = {
        chart: {
          type: "spline"
        },
        title: {
          text: "Historic EPS Surprises"
        },

        xAxis: {
          categories: val_x,
        },
        tooltip: {
          shared: true,

        },
        yAxis: {
          title: {
            text: "Quantity EPS"
          }
        },

        series: [{
          name: 'Actual',
          data: data_actual
        },
        {
          name: 'Estimate',
          data: data_estimate
        },
        ]
      };
    });
  }
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }

  // this.service.getChartSummaryTab(this.symbol, 1648180447).subscribe((hourlyData: any) => {
  //   this.stock_hour = hourlyData.data;
  //   console.log("hour", this.stock_hour);
  //   let data = []
  //   for (let index = 0; index < this.stock_hour.t.length; index++) {
  //     let t = new Date(this.stock_hour.t[index] * 1000);
  //     data.push([t.getTime(), this.stock_hour.c[index]]);
  //   }

  //   this.hourlyChartOptions = {
  //     time: {
  //       useUTC: false,
  //       timezone: 'America/Los_Angeles',
  //     },
  //     chart: {
  //       type: 'spline',
  //       height: 680,
  //       width: 740
  //     },
  //     title: {
  //       text: "TSLA" + ' Hourly Price Variation',
  //       style: {
  //         fontSize: '11px',
  //         color: 'gray'
  //       }
  //     },
  //     tooltip: {
  //       split: true
  //     },
  //     xAxis: {
  //       type: 'datetime',
  //       labels: {
  //         style: {
  //           fontSize: '8px'
  //         }
  //       },
  //       tickPixelInterval: 50,
  //       crosshair: true
  //     },
  //     scrollbar: {
  //       enabled: true
  //     },
  //     legend: { enabled: false },
  //     yAxis: {
  //       title: {
  //         text: null
  //       },
  //       labels: {
  //         style: {
  //           fontSize: '8px'
  //         }
  //       },
  //       opposite: true,
  //     },
  //     series: [{
  //       name: "TSLA",
  //       type: 'line',
  //       data: data,
  //       marker: {
  //         enabled: false
  //       }
  //     }]
  //   }


  // });


  /*reloadPage(ticker : string){
    console.log(ticker);
    this.router.navigateByUrl('/search/'+ ticker);
  }*/
}


