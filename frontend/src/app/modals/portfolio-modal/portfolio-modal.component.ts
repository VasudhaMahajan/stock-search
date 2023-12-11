import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalstorageService } from 'src/app/config/localstorage.service';
import { Service } from 'src/app/config/service';

@Component({
  selector: 'app-portfolio-modal',
  templateUrl: './portfolio-modal.component.html',
  styleUrls: ['./portfolio-modal.component.css']
})
export class PortfolioModalComponent implements OnInit {

  @Input() symbol: any;
  @Input() symbolname: any;
  @Input() buySell: any;

  myControl = new FormControl();

  localstoragePortfolio: any = [];
  moneyInWallet: number = 0;
  resultprices: any = {};

  updatedQuantity: number = 0;
  disabled = true;
  cannotbuyorsell = "";
  quantity: number = 0;

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

  constructor(private activeModal: NgbActiveModal, private service: Service, private localstorage: LocalstorageService) {

    if (localstorage.get("portfolio") == null) {
      this.localstoragePortfolio = null;
    } else {
      this.localstoragePortfolio = JSON.parse(this.localstorage.get("portfolio"));
      for (let i = 0; i < this.localstoragePortfolio.length; i++) {
        if (this.localstoragePortfolio[i].folioTicker === this.symbol) {
          this.quantity = this.localstoragePortfolio[i].quantity;
        }
      }
    }
    if(this.localstorage.get("moneyInWallet")){
      this.moneyInWallet = Math.round(localstorage.get("moneyInWallet") * 100)/100;
    } else{
      this.moneyInWallet = 25000.00;
      this.localstorage.set("moneyInWallet", 25000);
    }
    

    this.myControl.valueChanges.subscribe((qty: number) => {
      this.updatedQuantity = qty;
      if (qty > 0) {
        this.cannotbuyorsell ='';
        if (this.buySell == 'buy') {
          if (this.updatedQuantity * this.resultprices.c <= this.moneyInWallet) {
            this.disabled = false;
          }
          else {
            this.disabled = true;
            this.cannotbuyorsell = "Not enough money in wallet!";
          }
        }
        else if (this.buySell == 'sell') {
          if(qty > this.quantity){
            this.disabled = true;
            this.cannotbuyorsell = "You cannot sell the stock you don't have!";
          } else{
            this.disabled = false;
          }
        }
      } else{
        this.disabled = true;
        this.cannotbuyorsell ='';
      }

    });
  }

  ngOnInit(): void {
    this.service.getLatestPrice(this.symbol).subscribe(data => {
      this.resultprices = data.data;
      console.log(data.data);
    });
    this.localstoragePortfolio = JSON.parse(this.localstorage.get("portfolio"));
    for (let i = 0; i < this.localstoragePortfolio.length; i++) {
      if (this.localstoragePortfolio[i].folioTicker === this.symbol) {
        this.quantity = this.localstoragePortfolio[i].quantity;
      }
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  closeModalBuySell(method: any) {

    let result = [];
    if (method == 'buy') {

      if (this.localstoragePortfolio == null) {
        this.localstoragePortfolio = [];
        let costofbuying: number = this.resultprices.c * this.updatedQuantity;
        if (this.moneyInWallet > costofbuying) {
          this.temp.folioTicker = this.symbol;
          this.temp.symbolname = this.symbolname;
          this.temp.quantity = this.updatedQuantity;
          this.temp.totalCost = costofbuying;
          this.temp.costPerShare = costofbuying / this.updatedQuantity;
          this.moneyInWallet = this.moneyInWallet - costofbuying;

          //changes----------
          this.temp.currentPrice = this.resultprices.c;
          this.temp.change = Math.round((this.temp.costPerShare - this.resultprices.c)*100)/100;
          this.temp.marketValue = this.resultprices.c * this.temp.quantity;
          //----------------
          this.localstorage.set('moneyInWallet', this.moneyInWallet);
          this.localstoragePortfolio.push(this.temp);
          this.localstorage.set('portfolio', this.localstoragePortfolio);
          console.log(JSON.parse(this.localstorage.get("portfolio")));
        }
      } else {
        var flag = false;
        for (let i = 0; i < this.localstoragePortfolio.length; i++) {
          if (this.localstoragePortfolio[i].folioTicker === this.symbol) {
            let costofbuying: number = this.resultprices.c * this.updatedQuantity;
            if (this.moneyInWallet > costofbuying) {
              this.localstoragePortfolio[i].quantity = this.localstoragePortfolio[i].quantity + this.updatedQuantity;
              this.localstoragePortfolio[i].totalCost = costofbuying + this.localstoragePortfolio[i].totalCost;
              this.localstoragePortfolio[i].costPerShare = this.localstoragePortfolio[i].totalCost / this.localstoragePortfolio[i].quantity;
              //changes----------
              this.localstoragePortfolio[i].currentPrice = this.resultprices.c;
              this.localstoragePortfolio[i].change = Math.round((this.localstoragePortfolio[i].costPerShare - this.resultprices.c) * 100) / 100;
              this.localstoragePortfolio[i].marketValue = this.resultprices.c * this.localstoragePortfolio[i].quantity;
              //----------------
              this.moneyInWallet = this.moneyInWallet - costofbuying;
              this.localstorage.set('moneyInWallet', this.moneyInWallet);
              this.localstorage.set('portfolio', this.localstoragePortfolio);
            }
            flag = true;
          }
        }
        if (!flag) {
          let costofbuying: number = this.resultprices.c * this.updatedQuantity;
          if (this.moneyInWallet > costofbuying) {
            this.temp.folioTicker = this.symbol;
            this.temp.symbolname = this.symbolname;
            this.temp.quantity = this.updatedQuantity;
            this.temp.totalCost = costofbuying;
            this.temp.costPerShare = costofbuying / this.updatedQuantity;

            //changes----------
            this.temp.currentPrice = this.resultprices.c;
            this.temp.change = Math.round((this.temp.costPerShare - this.resultprices.c) * 100) / 100;
            this.temp.marketValue = this.resultprices.c * this.temp.quantity;
            //----------------

            this.moneyInWallet = this.moneyInWallet - costofbuying;
            this.localstorage.set('moneyInWallet', this.moneyInWallet);
            this.localstoragePortfolio.push(this.temp);
            this.localstorage.set('portfolio', this.localstoragePortfolio);
            console.log(JSON.parse(this.localstorage.get("portfolio")));
          }
        }
      }
    }
    if (method == 'sell') {
      for (let i = 0; i < this.localstoragePortfolio.length; i++) {
        if (this.localstoragePortfolio[i].folioTicker === this.symbol) {
          let costofselling: number = this.resultprices.c * this.updatedQuantity;
          if (this.localstoragePortfolio[i].quantity > this.updatedQuantity) {
            this.localstoragePortfolio[i].totalCost = this.localstoragePortfolio[i].totalCost - this.localstoragePortfolio[i].costPerShare * this.updatedQuantity;
            this.localstoragePortfolio[i].quantity = this.localstoragePortfolio[i].quantity - this.updatedQuantity;
            this.localstoragePortfolio[i].costPerShare = this.localstoragePortfolio[i].totalCost / this.localstoragePortfolio[i].quantity;
            //------------changes
            this.localstoragePortfolio[i].currentPrice = this.resultprices.c;
            this.localstoragePortfolio[i].change = Math.round((this.localstoragePortfolio[i].costPerShare - this.resultprices.c) * 100)/100;
            this.localstoragePortfolio[i].marketValue = this.resultprices.c * this.localstoragePortfolio[i].quantity;
            //----------------

            this.moneyInWallet = +costofselling + +this.moneyInWallet;
            this.localstorage.set('portfolio', this.localstoragePortfolio);
            this.localstorage.set('moneyInWallet', this.moneyInWallet);
          }
          else if (this.localstoragePortfolio[i].quantity == this.updatedQuantity) {
            let temparray = [];
            for (let j = 0; j < this.localstoragePortfolio.length; j++) {
              if (j != i) {
                temparray.push(this.localstoragePortfolio[j]);
              }
            }
            this.moneyInWallet = +costofselling + +this.moneyInWallet;
            this.localstorage.set('portfolio', temparray);
            this.localstorage.set('moneyInWallet', this.moneyInWallet);
            console.log(JSON.parse(this.localstorage.get("portfolio")));
          }
        }
      }
    }
    result.push(JSON.parse(this.localstorage.get("portfolio")));
    result.push(this.moneyInWallet);

    this.activeModal.close(result);
  }
}
