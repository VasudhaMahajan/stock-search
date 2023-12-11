import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../config/localstorage.service';
import { Service } from '../config/service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})

export class WatchlistComponent implements OnInit {
  watchlist: any = [];
  alert = {
    type: "",
    message : ""
  }

  alertmessagestr = "Currently you don't have any stock in your watchlist.";
  alertmessagetype = 'warning'

  constructor(private localstorage: LocalstorageService, private service: Service) {
    this.watchlist = this.localstorage.get('watchlist');
    console.log(this.watchlist);

    if (this.localstorage.get("watchlist")!= null && this.localstorage.get('watchlist') != '[]') {
      this.watchlist = JSON.parse(this.localstorage.get("watchlist"));
      for (let currw of this.watchlist) {
        this.service.getLatestPrice(currw.symbol).subscribe(data => {
          currw.c = data.data.c;
          currw.dp = data.data.dp;
          currw.d = data.data.d;
        });
      }
    } else {
      this.watchlist = [];
      this.alert.type = 'warning';
      this.alert.message = "Currently you don't have any stock in your watchlist.";
    }

    console.log(this.watchlist);
  }

  ngOnInit(): void {
  }

  removefromwatchlist(symbol : string){
    let removeIndex = 0;
    for(let i = 0; i < this.watchlist.length; i++){
      if(this.watchlist[i].symbol == symbol)
        removeIndex = i;
    }

    this.watchlist.splice(removeIndex, 1);
    
    if(this.watchlist.length == 0){
      this.alert.message = this.alertmessagestr;
      this.alert.type = this.alertmessagetype;
    }
    
    this.localstorage.set('watchlist', this.watchlist);
    console.log(JSON.parse(this.localstorage.get("watchlist")));
  }

}
