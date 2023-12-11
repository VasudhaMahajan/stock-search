import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
export class Service {
  constructor(private http: HttpClient) { }
  // private hostUrl ="https://hw8-backend-f1.wn.r.appspot.com";
  private hostUrl ="http://localhost:3001";

  public getTopNews(symbol : string){
    return this.http.get<any>(this.hostUrl + "/top-news?symbol=" + symbol.toUpperCase());
  }
  
  public getLatestPrice(symbol : string){
    return this.http.get<any>(this.hostUrl + "/getdata-latest-price?symbol="+ symbol.toUpperCase());
  }

  public getDescription(symbol : string){
    return this.http.get<any>(this.hostUrl + "/getdata-description?symbol="+ symbol.toUpperCase());
  }

  public getPeers(symbol : string){
    return this.http.get<any>(this.hostUrl + "/getdata-peers?symbol="+ symbol.toUpperCase());
  }

  public getAutocompleteSuggestion(symbol : string) : Observable<any>{
    return this.http.get<any>(this.hostUrl + "/autocomplete?symbol="+ symbol.toUpperCase());
  }

  public getChartSummaryTab(symbol : string, to : any){
    return this.http.get<any>(this.hostUrl + "/getdata-historical-summary-tab?symbol="+ symbol.toUpperCase()+"&to="+to);
  }
  
  public getSMAVolumeChartTab(symbol : string){
    return this.http.get<any>(this.hostUrl + "/getdata-historical-charts-tab?symbol="+ symbol.toUpperCase());
  }

  public getEarningsInsightsTab(symbol : string){
    return this.http.get<any>(this.hostUrl + "/earnings?symbol="+ symbol.toUpperCase());
  }

  public getSocialSentimentsInsightsTab(symbol : string){
    return this.http.get<any>(this.hostUrl + "/social-sentiment?symbol="+ symbol.toUpperCase());
  }
  
  public getRecommendationsInsightsTab(symbol : string){
    return this.http.get<any>(this.hostUrl + "/recommendations?symbol="+ symbol.toUpperCase());
  }
  

  
}