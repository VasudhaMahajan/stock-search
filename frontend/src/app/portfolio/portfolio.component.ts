import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject } from 'rxjs';
import { LocalstorageService } from '../config/localstorage.service';
import { Service } from '../config/service';
import { PortfolioModalComponent } from '../modals/portfolio-modal/portfolio-modal.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  moneyInWallet: number = 0;

  temp: any = {
    "folioTicker": "",
    "symbolname": "",
    "quantity": 0,
    "totalCost": 0,
    "costPerShare": 0,
    "change": 0,
    "marketValue": 0,
    "currentPrice": 0
  }

  resultprices: any = [];
  companyData: any = [];
  localstoragePortfolio: any[] = [];
  alert = {
    type: "",
    message: ""
  }

  private _success = new Subject<string>();
  @ViewChild('selfClosingAlert', { static: false })
  selfClosingAlert!: NgbAlert;
  successMessage = '';
  issuccessful: any = true;
  alertcolor = "";

  constructor(private service: Service, private modalService: NgbModal, private localstorage: LocalstorageService) {
    // localstorage.remove("portfolio");
    // localstorage.remove("moneyInWallet");

    if (localstorage.get("moneyInWallet") != null) {
      this.moneyInWallet = Math.round(localstorage.get("moneyInWallet") * 100) / 100;
    } else {
      this.moneyInWallet = 25000.00;
      this.localstorage.set("moneyInWallet", 25000.00);
    }

    // localstorage.set("portfolio", [this.folioA, this.folioB]);

    // this.localstorage.set("moneyInWallet", 25000);
    if (this.localstorage.get("portfolio") != null && this.localstorage.get("portfolio") != '[]') {
      let lsp = JSON.parse(this.localstorage.get("portfolio"));
      console.log(lsp);
      let arr = Array<any>(lsp.length);
      // for (let result of lsp) {
      //   service.getLatestPrice(result.folioTicker).subscribe(data => {
      // lsp.forEach((element: any) => {
      //   console.log(element);
      //   console.log(result.folioTicker);
      //   if (element.folioTicker == result.folioTicker) {
      //     element.folioTicker = result.folioTicker;
      //     element.symbolname = element.symbolname;
      //     element.quantity = element.quantity;
      //     element.totalCost = element.totalCost;
      //     element.costPerShare = element.costPerShare;
      //     element.change = element.costPerShare - data.data.c;
      //     element.currentPrice = data.data.c;
      //     element.marketValue = data.data.c * element.quantity;
      //     console.log(element);
      //     this.localstoragePortfolio.push(element);
      //   }
      // });
      //   });
      // }
      for (let i = 0; i < lsp.length; i++) {
        let element = lsp[i];
        this.service.getLatestPrice(lsp[i].folioTicker).subscribe(data => {
          element.change = Math.round((element.costPerShare - data.data.c) * 100)/100;
          element.currentPrice = data.data.c;
          element.marketValue = data.data.c * element.quantity;
          this.localstoragePortfolio[i] = element;
        });
      }
      // this.localstoragePortfolio = arr;
      console.log(this.localstoragePortfolio); ////////--------check below line is required or not
      // this.localstorage.set('portfolio', this.localstoragePortfolio);


      // for (var i = 0; i < this.localstoragePortfolio.length; i++) {
      //   let symbol = this.localstoragePortfolio[i].folioTicker;

      //   service.getLatestPrice(symbol).subscribe(data => {
      //     this.resultprices.push(data.data);
      //   });

      //   // service.getDescription(symbol).subscribe(data1 => {
      //   //   this.companyData.push(data1.data);
      //   //   console.log(data1.data);
      //   // })
      // }
    } else {
      this.localstoragePortfolio = [];
      this.alert.type = 'warning';
      this.alert.message = "Currently you don't have any stock.";
    }
  }


  ngOnInit(): void {
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });
  }

  public changeSuccessMessage(alertcolor: any, message: string) {
    this.alertcolor = alertcolor;
    this._success.next(message);
  }

  openModal(symbol: string, buySell: string) {
    // console.log(this.resultprices);
    // console.log(this.companyData);
    const modalRef = this.modalService.open(PortfolioModalComponent, {
      windowClass: 'myCustomModalClass',
      scrollable: true,
    });

    modalRef.componentInstance.symbol = symbol;
    modalRef.componentInstance.buySell = buySell;

    modalRef.result.then((data) => {
      console.log(data);
      this.moneyInWallet = Math.round(data[1] * 100) / 100;
      this.localstoragePortfolio = data[0];
      if (data[0].length == 0) {
        this.alert.type = 'warning';
        this.alert.message = "Currently you don't have any stock.";
      }
      if (buySell == 'buy') {
        this.changeSuccessMessage('success', symbol.toUpperCase() + " bought successfully.");
      } else {
        this.changeSuccessMessage('danger', symbol.toUpperCase() + " sold successfully.");
      }

      console.log(this.localstoragePortfolio);
    });
  }

}
