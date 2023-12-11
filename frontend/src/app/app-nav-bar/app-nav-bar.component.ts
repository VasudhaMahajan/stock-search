import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../config/localstorage.service';
import { StateService } from '../config/state.service';

@Component({
  selector: 'app-app-nav-bar',
  templateUrl: './app-nav-bar.component.html',
  styleUrls: ['./app-nav-bar.component.css']
})
export class AppNavBarComponent implements OnInit {
  // url : string = "/search/home";
  symbol = "home";
  constructor(private localstorage: LocalstorageService, private stateservice : StateService) {
    this.symbol = stateservice.globalsymbol;
  //   var symbol  = JSON.parse(localstorage.get("symbol"))
  //  this.url = "/search/" + symbol;
   }

  ngOnInit(): void {
    this.symbol = this.stateservice.globalsymbol;
    // this.url = "/search/" + this.localstorage.get("symbol");

  }
}
